import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { ROOMS } from "./clinicData.js";

// ============================================================
// 1. Scene, Renderer, Camera & Lighting
// ============================================================
const canvas = document.getElementById("scene-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a);
scene.fog = new THREE.FogExp2(0x0f172a, 0.014);

const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 160);
camera.position.set(11.5, 11.0, 14.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.maxPolarAngle = Math.PI * 0.48;
controls.minDistance = 2.0;
controls.maxDistance = 36.0;
controls.target.set(0, 0.6, 0.5);

// Warm architectural lighting
const hemiLight = new THREE.HemisphereLight(0xf8fafc, 0x334155, 0.85);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.55);
sunLight.position.set(14, 22, 16);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.near = 2;
sunLight.shadow.camera.far = 60;
const d = 15;
sunLight.shadow.camera.left = -d;
sunLight.shadow.camera.right = d;
sunLight.shadow.camera.top = d;
sunLight.shadow.camera.bottom = -d;
sunLight.shadow.bias = -0.0005;
scene.add(sunLight);

// Soft warm interior fill lights for welcoming atmosphere
const fillLights = [
  [-4.0, 2.4, 3.6, 0xffe8c8, 1.6],   // Recepção
  [-6.3, 2.3, -3.4, 0xffdfb8, 1.4],  // Consultório 1 (Ana)
  [-2.9, 2.3, -3.4, 0xfff1d6, 1.4],  // Sala Infantil (Lari)
  [0.5, 2.3, -3.4, 0xfff5e4, 1.4],   // Consultório 3 (Julia)
  [3.9, 2.3, -3.4, 0xfff5e4, 1.4],   // Consultório 4 (Maria Eduarda)
  [2.75, 2.4, 3.5, 0xf8fafc, 1.5],   // Sala de Psicodrama (Camilly)
  [6.8, 2.3, -3.75, 0xe0f2fe, 1.2],  // Sanitário PCD
];
for (const [lx, ly, lz, color, intensity] of fillLights) {
  const pl = new THREE.PointLight(color, intensity, 9, 1.5);
  pl.position.set(lx, ly, lz);
  scene.add(pl);
}

// ============================================================
// 2. Architectural Structure (Floors, Ramp, Walls, Doors, NBR 9050 Guides)
// ============================================================
const clickableMeshes = [];
const nbrGuidesGroup = new THREE.Group();
scene.add(nbrGuidesGroup);

// Ground surroundings
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(90, 90),
  new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.95 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.18;
ground.receiveShadow = true;
scene.add(ground);

// Subtle grid
const grid = new THREE.GridHelper(48, 48, 0x334155, 0x1e293b);
grid.position.y = -0.17;
scene.add(grid);

// Main concrete slab (16m x 12m, elevated 0.16m for ramp realism)
const slabMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.85 });
const mainSlab = new THREE.Mesh(new THREE.BoxGeometry(16.4, 0.16, 12.4), slabMat);
mainSlab.position.set(0, -0.08, 0);
mainSlab.receiveShadow = true;
scene.add(mainSlab);

// Front porch + Wheelchair Ramp (NBR 9050 <= 8.33% slope)
const porch = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.16, 1.6), slabMat);
porch.position.set(-1.5, -0.08, 6.8);
porch.receiveShadow = true;
porch.userData.roomId = "entrada-acessivel";
scene.add(porch);
clickableMeshes.push(porch);

// Ramp sloping from y=-0.16 at z=9.6 to y=0 at z=7.6 (2.0m run, 0.16m rise => 8.0% slope!)
const rampGeo = new THREE.BufferGeometry();
const rx0 = -0.7, rx1 = 0.9;
const rzTop = 7.6, rzBot = 9.6;
const ryTop = 0.0, ryBot = -0.16;
const rampVerts = new Float32Array([
  // Top sloped surface
  rx0, ryTop, rzTop,  rx0, ryBot, rzBot,  rx1, ryBot, rzBot,
  rx0, ryTop, rzTop,  rx1, ryBot, rzBot,  rx1, ryTop, rzTop,
  // Left side
  rx0, ryBot, rzTop,  rx0, ryBot, rzBot,  rx0, ryTop, rzTop,
  // Right side
  rx1, ryTop, rzTop,  rx1, ryBot, rzBot,  rx1, ryBot, rzTop,
]);
rampGeo.setAttribute("position", new THREE.BufferAttribute(rampVerts, 3));
rampGeo.computeVertexNormals();
const rampMesh = new THREE.Mesh(
  rampGeo,
  new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 })
);
rampMesh.receiveShadow = true;
rampMesh.userData.roomId = "entrada-acessivel";
scene.add(rampMesh);
clickableMeshes.push(rampMesh);

// Zone Floor Helper
function addFloorZone(x, z, w, d, color, roomId) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0.05 })
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(x, 0.005, z);
  mesh.receiveShadow = true;
  if (roomId) {
    mesh.userData.roomId = roomId;
    clickableMeshes.push(mesh);
  }
  scene.add(mesh);
  return mesh;
}

// Room floors
addFloorZone(-4.0, 3.5, 8.0, 5.0, 0xe8dfd1, "recepcao");          // Recepção
addFloorZone(2.75, 3.5, 5.5, 5.0, 0xdce6ed, "espaco-coletivo");   // Sala de Grupos
addFloorZone(6.75, 3.5, 2.5, 5.0, 0xd1d5db, "copa-apoio");        // Copa / Apoio
addFloorZone(0.0, 0.1, 16.0, 1.8, 0xe2e8f0, "corredor-acessivel");// Corredor 1.80m
addFloorZone(-6.3, -3.4, 3.4, 5.2, 0xead8c0, "consultorio-1");   // Consultório 1 (Ana)
addFloorZone(-2.9, -3.4, 3.4, 5.2, 0xf3e8dc, "consultorio-2");   // Sala Infantil (Lari)
addFloorZone(0.5, -3.4, 3.4, 5.2, 0xeae2d6, "consultorio-3");    // Consultório 3 (Julia)
addFloorZone(3.9, -3.4, 3.4, 5.2, 0xe8dfd1, "consultorio-4");    // Consultório 4 (Maria Eduarda)
addFloorZone(6.8, -3.4, 2.4, 5.2, 0xcbe4ea, "sanitario-pcd");    // Sanitário PCD

// Tactile yellow paving strips (NBR 9050)
const tactileMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.55 });
function addTactileStrip(x, z, w, d, y = 0.012) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.01, d), tactileMat);
  m.position.set(x, y, z);
  nbrGuidesGroup.add(m);
}
addTactileStrip(0.1, 6.8, 0.25, 1.5);       // Entrada até recepção
addTactileStrip(-1.5, 6.05, 3.4, 0.25);    // Patamar entrada
addTactileStrip(-3.2, 3.8, 0.25, 4.2);      // Direcional recepção -> corredor
addTactileStrip(0.0, 0.1, 13.5, 0.25);      // Direcional ao longo do corredor

// Sala de Psicodrama — Palco delimitado no chão (Cenário Moreniano)
const stageMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.85 });
const stageDisc = new THREE.Mesh(new THREE.CircleGeometry(1.32, 48), stageMat);
stageDisc.rotation.x = -Math.PI / 2;
stageDisc.position.set(2.75, 0.011, 3.55);
stageDisc.receiveShadow = true;
stageDisc.userData.roomId = "espaco-coletivo";
scene.add(stageDisc);
clickableMeshes.push(stageDisc);

const stageBorder = new THREE.Mesh(
  new THREE.RingGeometry(1.30, 1.38, 48),
  new THREE.MeshBasicMaterial({ color: 0xd97706, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
);
stageBorder.rotation.x = -Math.PI / 2;
stageBorder.position.set(2.75, 0.014, 3.55);
scene.add(stageBorder);

// NBR 9050 1.50m diameter wheelchair turning circles
function addTurningCircle(x, z) {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.68, 0.75, 48),
    new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide, transparent: true, opacity: 0.72 })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(x, 0.015, z);
  nbrGuidesGroup.add(ring);
}
addTurningCircle(-2.2, 3.8);    // Recepção
addTurningCircle(0.0, 0.1);     // Corredor
addTurningCircle(-5.5, -2.0);   // Consultório 1
addTurningCircle(6.8, -2.6);    // Sanitário PCD

// Wall builder
const wallMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85 });
const glassMat = new THREE.MeshPhysicalMaterial({
  color: 0xbfe3f7,
  transparent: true,
  opacity: 0.42,
  roughness: 0.25,
  metalness: 0.05,
});
const frameMat = new THREE.MeshStandardMaterial({ color: 0x7c5c3e, roughness: 0.65 });
const H = 2.65; // Wall height (cutaway open-top)
const T = 0.16; // Acoustic double-wall thickness

function addWall(x1, z1, x2, z2, roomId = null, isGlass = false, height = H) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.hypot(dx, dz);
  if (len < 0.01) return;
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(len, height, T),
    isGlass ? glassMat : wallMat
  );
  mesh.position.set((x1 + x2) / 2, height / 2, (z1 + z2) / 2);
  mesh.rotation.y = -Math.atan2(dz, dx);
  mesh.castShadow = !isGlass;
  mesh.receiveShadow = true;
  if (roomId) {
    mesh.userData.roomId = roomId;
    clickableMeshes.push(mesh);
  }
  scene.add(mesh);
  return mesh;
}

// Helper: wall with a doorway opening (0.95m wide) + open door leaf
function addWallWithDoor(x1, z1, x2, z2, doorCenterT = 0.5, doorWidth = 0.98, roomId = null) {
  const dx = x2 - x1;
  const dz = z2 - z1;
  const len = Math.hypot(dx, dz);
  const ux = dx / len;
  const uz = dz / len;

  const doorStart = Math.max(0, len * doorCenterT - doorWidth / 2);
  const doorEnd = Math.min(len, len * doorCenterT + doorWidth / 2);

  if (doorStart > 0.05) {
    addWall(x1, z1, x1 + ux * doorStart, z1 + uz * doorStart, roomId);
  }
  if (len - doorEnd > 0.05) {
    addWall(x1 + ux * doorEnd, z1 + uz * doorEnd, x2, z2, roomId);
  }
  // Lintel above door
  const lx1 = x1 + ux * doorStart;
  const lz1 = z1 + uz * doorStart;
  const lx2 = x1 + ux * doorEnd;
  const lz2 = z1 + uz * doorEnd;
  const lintelH = H - 2.12;
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, lintelH, T), wallMat);
  lintel.position.set((lx1 + lx2) / 2, 2.12 + lintelH / 2, (lz1 + lz2) / 2);
  lintel.rotation.y = -Math.atan2(dz, dx);
  lintel.castShadow = true;
  scene.add(lintel);

  // Open door leaf (45 deg) so rooms feel real & walkable
  const doorGroup = new THREE.Group();
  doorGroup.position.set(lx1, 0, lz1);
  doorGroup.rotation.y = -Math.atan2(dz, dx) - Math.PI * 0.28;
  const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(doorWidth - 0.04, 2.08, 0.05), frameMat);
  doorLeaf.position.set((doorWidth - 0.04) / 2, 1.04, 0);
  doorLeaf.castShadow = true;
  doorGroup.add(doorLeaf);
  scene.add(doorGroup);
}

// Exterior Perimeter Walls
// South (Front, z = +6): main entrance door at x = -1.5, plus frosted windows
addWall(-8, 6, -5.8, 6, "recepcao");
addWall(-5.8, 6, -3.4, 6, "recepcao", true); // Frosted window
addWallWithDoor(-3.4, 6, 0, 6, 0.56, 1.25, "recepcao"); // Main accessible double door
addWall(0, 6, 1.4, 6, "espaco-coletivo");
addWall(1.4, 6, 4.2, 6, "espaco-coletivo", true);
addWall(4.2, 6, 8, 6, "copa-apoio");

// North (Back, z = -6): frosted privacy windows in consultórios
addWall(-8, -6, -7.2, -6, "consultorio-1");
addWall(-7.2, -6, -5.4, -6, "consultorio-1", true);
addWall(-5.4, -6, -3.8, -6, "consultorio-2");
addWall(-3.8, -6, -2.0, -6, "consultorio-2", true);
addWall(-2.0, -6, -0.4, -6, "consultorio-3");
addWall(-0.4, -6, 1.4, -6, "consultorio-3", true);
addWall(1.4, -6, 3.0, -6, "consultorio-4");
addWall(3.0, -6, 4.8, -6, "consultorio-4", true);
addWall(4.8, -6, 8, -6, "sanitario-pcd");

// West (x = -8) & East (x = +8)
addWall(-8, -6, -8, 6);
addWall(8, -6, 8, 6);

// Interior Partitions (South Wing: z = +1)
addWallWithDoor(-8, 1, 0, 1, 0.72, 1.15, "recepcao");          // Recepção -> Corredor
addWallWithDoor(0, 1, 5.5, 1, 0.3, 1.05, "espaco-coletivo");    // Sala de Grupos -> Corredor
addWallWithDoor(5.5, 1, 8, 1, 0.5, 0.92, "copa-apoio");         // Copa -> Corredor
addWall(0, 1, 0, 6, "recepcao");                                // Entre Recepção e Sala de Grupos
addWall(5.5, 1, 5.5, 6, "copa-apoio");                          // Entre Sala de Grupos e Copa

// Interior Partitions (North Wing: z = -0.8)
addWallWithDoor(-8, -0.8, -4.6, -0.8, 0.72, 0.95, "consultorio-1");
addWallWithDoor(-4.6, -0.8, -1.2, -0.8, 0.72, 0.95, "consultorio-2");
addWallWithDoor(-1.2, -0.8, 2.2, -0.8, 0.72, 0.95, "consultorio-3");
addWallWithDoor(2.2, -0.8, 5.6, -0.8, 0.72, 0.95, "consultorio-4");
addWallWithDoor(5.6, -0.8, 8.0, -0.8, 0.45, 0.95, "sanitario-pcd");

addWall(-4.6, -6, -4.6, -0.8, "consultorio-1");
addWall(-1.2, -6, -1.2, -0.8, "consultorio-2");
addWall(2.2, -6, 2.2, -0.8, "consultorio-3");
addWall(5.6, -6, 5.6, -0.8, "consultorio-4");

// NBR 9050 Grab Bars in Sanitário PCD (next to toilet at x=7.35, z=-4.8)
const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.85, roughness: 0.25 });
function addGrabBar(x, y, z, rx, ry, rz, len = 0.8) {
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, len, 12), chromeMat);
  bar.position.set(x, y, z);
  bar.rotation.set(rx, ry, rz);
  nbrGuidesGroup.add(bar);
}
addGrabBar(7.85, 0.75, -4.75, Math.PI / 2, 0, 0, 0.8); // Side wall grab bar
addGrabBar(7.35, 0.75, -5.82, 0, 0, Math.PI / 2, 0.8); // Back wall grab bar

// ============================================================
// 3. Load & Place Polyfork 3D Assets (GLB from Polyfork MCP)
// ============================================================
const loader = new GLTFLoader();
const modelCache = new Map();

// [assetId, x, y, z, rotYDeg, scale, roomId]
const PLACEMENTS = [
  // Entrada Acessível
  ["corridor-handrail-run-cc6555", -0.72, -0.08, 8.6, 90, 1.0, "entrada-acessivel"],
  ["corridor-handrail-run-cc6555", 0.92, -0.08, 8.6, 90, 1.0, "entrada-acessivel"],
  ["potted-shrub-43bd21", -2.3, 0, 6.5, 0, 0.9, "entrada-acessivel"],
  ["potted-shrub-43bd21", 1.5, 0, 6.5, 40, 0.9, "entrada-acessivel"],
  ["wheelchair-0584dc", -3.1, 0, 6.7, 25, 1.0, "entrada-acessivel"],
  ["hand-sanitiser-dispenser-a48460", -0.15, 0, 5.4, -90, 1.0, "recepcao"],

  // Recepção & Sala de Espera
  ["reception-desk-3d6913", -5.8, 0, 4.6, 0, 1.0, "recepcao"],
  ["sit-stand-desk-3ff7b8", -4.1, 0, 4.75, 0, 0.85, "recepcao"], // Módulo rebaixado NBR 9050!
  ["laptop-e775ba", -5.8, 1.1, 4.18, 0, 1.0, "recepcao"],
  ["wayfinding-totem-sign-dbb4be", -0.45, 0, 2.2, -90, 0.8, "recepcao"],
  ["acoustic-planter-divider-3e9130", -3.9, 0, 2.7, 90, 1.0, "recepcao"],
  ["wool-rug-ab2bd1", -6.2, 0.01, 2.5, 90, 0.9, "recepcao"],
  ["sofa-9c0e7e", -7.2, 0, 2.5, 90, 1.0, "recepcao"],
  ["waiting-room-chair-5e20cc", -5.2, 0, 1.8, 0, 1.0, "recepcao"],
  ["waiting-room-chair-5e20cc", -6.0, 0, 1.8, 0, 1.0, "recepcao"],
  ["coffee-table-acc698", -5.9, 0, 2.6, 0, 0.9, "recepcao"],
  ["arc-floor-lamp-fa0b5f", -7.4, 0, 1.5, 45, 1.0, "recepcao"],
  ["floor-houseplant-8fad17", -7.3, 0, 5.3, 0, 1.0, "recepcao"],
  ["wall-clock-05f8ff", -5.8, 0, 5.88, 180, 1.0, "recepcao"],

  // Pessoas na Recepção
  ["standing-worker-on-a-8a0f9a", -5.8, 0, 4.72, 180, 0.95, "recepcao", "stand", "Olá! Seja bem-vindo(a) à Clínica Entrelaço."],
  ["visitor-with-badge-1005a3", -5.65, 0, 3.65, 0, 0.95, "recepcao", "stand", "Obrigado! Tenho horário agendado."],
  ["student-in-a-hoodie-7c8223", -6.95, 0, 2.5, 90, 0.95, "recepcao", "sit", "O ambiente aqui é bem calmo, né?"],
  ["commuter-381e7f", -5.2, 0, 1.85, 0, 0.95, "recepcao", "sit", "Sim, bem acolhedor e silencioso.", { hair: 0x7c2d12, top: 0x0f766e, bottom: 0x334155 }],

  // Corredor Principal
  ["illuminated-exit-sign-23becd", -1.5, 0, 0.9, 0, 1.0, "corredor-acessivel"],
  ["wall-first-aid-box-7ffc6c", 4.8, 0, 0.9, 180, 1.0, "corredor-acessivel"],
  ["fern-plant-1559b8", -7.4, 0, 0.6, 0, 0.75, "corredor-acessivel"],

  // Consultório 01 — Gestalt-Terapia (Ana) [x: -8..-4.6]
  ["area-rug-5c56e2", -6.3, 0.01, -3.5, 0, 0.85, "consultorio-1"],
  ["sofa-9c0e7e", -7.2, 0, -3.6, 90, 0.85, "consultorio-1"],
  ["lounge-armchair-5a72ca", -5.25, 0, -3.6, -90, 0.95, "consultorio-1"],
  ["coffee-table-acc698", -6.2, 0, -3.6, 90, 0.65, "consultorio-1"],
  ["arc-floor-lamp-fa0b5f", -7.5, 0, -5.2, 30, 1.0, "consultorio-1"],
  ["alcove-bookcase-83894d", -6.9, 0, -5.55, 0, 0.9, "consultorio-1"],
  ["tambour-storage-cupboard-cebe40", -5.1, 0, -5.55, 0, 0.9, "consultorio-1"], // Prontuários com chave
  ["paper-shredder-5366a6", -5.8, 0, -5.5, 0, 0.9, "consultorio-1"],
  ["floor-houseplant-8fad17", -7.4, 0, -1.5, 0, 0.8, "consultorio-1"],
  ["wall-clock-05f8ff", -7.88, 0, -3.6, 90, 1.0, "consultorio-1"], // Relógio na frente da psicóloga
  ["flight-attendant-befaf4", -5.25, 0, -3.6, -90, 0.95, "consultorio-1", "sit", "Ana (Gestalt): Como você percebe isso no aqui e agora?", { hair: 0x3b2314, top: 0x6d28d9, bottom: 0x1e293b }],
  ["seated-office-worker-854671", -7.1, 0, -3.6, 90, 0.95, "consultorio-1", "sit", "Bem mais tranquilo depois da última sessão."],

  // Sala Infantil — Ludoterapia & TCC (Lari) [x: -4.6..-1.2]
  ["area-rug-5c56e2", -2.9, 0.01, -3.5, 90, 0.95, "consultorio-2"],
  ["coffee-table-acc698", -2.9, 0, -3.5, 0, 0.85, "consultorio-2"],
  ["meeting-chair-731ce0", -3.75, 0, -3.5, 90, 0.85, "consultorio-2"],
  ["cushion-121479", -2.8, 0.02, -4.35, 0, 1.1, "consultorio-2"],
  ["cushion-121479", -3.3, 0.02, -4.25, 35, 1.1, "consultorio-2"],
  ["alcove-bookcase-83894d", -3.9, 0, -5.55, 0, 0.9, "consultorio-2"],
  ["woven-storage-basket-983d80", -2.0, 0, -5.3, 0, 1.05, "consultorio-2"],
  ["tambour-storage-cupboard-cebe40", -1.65, 0, -5.55, 0, 0.85, "consultorio-2"],
  ["fern-plant-1559b8", -4.15, 0, -1.4, 0, 0.75, "consultorio-2"],
  ["wall-clock-05f8ff", -1.32, 0, -3.5, -90, 1.0, "consultorio-2"], // Relógio na frente da psicóloga
  ["student-in-a-hoodie-7c8223", -3.75, 0, -3.5, 90, 0.95, "consultorio-2", "sit", "Lari (TCC): Qual história vamos montar hoje?", { hair: 0x78350f, top: 0x3b8272, bottom: 0x1e293b }],
  ["schoolkid-da94c1", -2.15, 0, -3.5, -90, 0.92, "consultorio-2", "stand", "Olha o foguete que eu escolhi!"],
  ["toy-rocket-e51241", -2.95, 0.4, -3.55, 20, 0.6, "consultorio-2"],
  ["beach-ball-4b2a9b", -2.7, 0.01, -2.25, 0, 0.95, "consultorio-2"],
  ["sack-of-toys-c53e9e", -2.95, 0, -5.35, 15, 0.7, "consultorio-2"],
  ["ball-bin-3198fe", -1.65, 0, -2.1, -45, 0.75, "consultorio-2"],

  // Consultório 03 — Existencialista (Julia) [x: -1.2..+2.2]
  ["area-rug-5c56e2", 0.5, 0.01, -3.5, 0, 0.85, "consultorio-3"],
  ["lounge-armchair-5a72ca", -0.35, 0, -3.5, 90, 0.95, "consultorio-3"],
  ["lounge-armchair-5a72ca", 1.35, 0, -3.5, -90, 0.95, "consultorio-3"],
  ["coffee-table-acc698", 0.5, 0, -3.5, 90, 0.65, "consultorio-3"],
  ["tambour-storage-cupboard-cebe40", 1.6, 0, -5.55, 0, 0.9, "consultorio-3"],
  ["alcove-bookcase-83894d", -0.45, 0, -5.55, 0, 0.9, "consultorio-3"],
  ["arc-floor-lamp-fa0b5f", -0.75, 0, -2.0, 45, 0.95, "consultorio-3"],
  ["floor-houseplant-8fad17", 1.7, 0, -1.6, 0, 0.8, "consultorio-3"],
  ["wall-clock-05f8ff", -1.08, 0, -3.5, 90, 1.0, "consultorio-3"], // Relógio na frente da psicóloga
  ["parent-chaperone-79e535", 1.35, 0, -3.5, -90, 0.95, "consultorio-3", "sit", "Julia (Existencialista): Que sentido isso tem para você hoje?", { hair: 0x7c2d12, top: 0x1e3a8a, bottom: 0x1f2937 }],
  ["visitor-with-badge-1005a3", -0.35, 0, -3.5, 90, 0.95, "consultorio-3", "sit", "Tenho refletido muito sobre minhas escolhas."],

  // Consultório 04 — Sistêmica Adulto e Adolescente (Maria Eduarda) [x: +2.2..+5.6]
  ["sit-stand-desk-3ff7b8", 3.9, 0, -4.65, 0, 0.95, "consultorio-4"],
  ["task-chair-ccd944", 3.9, 0, -5.3, 0, 0.95, "consultorio-4"],
  ["meeting-chair-731ce0", 3.9, 0, -3.95, 180, 0.95, "consultorio-4"],
  ["sofa-9c0e7e", 3.1, 0, -2.4, 90, 0.85, "consultorio-4"],
  ["tambour-storage-cupboard-cebe40", 5.05, 0, -5.55, 0, 0.9, "consultorio-4"],
  ["floor-houseplant-8fad17", 2.65, 0, -5.3, 0, 0.8, "consultorio-4"],
  ["wall-clock-05f8ff", 3.9, 0, -0.92, 180, 1.0, "consultorio-4"], // Relógio na frente da psicóloga
  ["flight-attendant-befaf4", 3.9, 0, -5.25, 0, 0.95, "consultorio-4", "sit", "Maria Eduarda (Sistêmica): Como você tem percebido suas relações esta semana?", { hair: 0xd97706, top: 0xc2410c, bottom: 0x334155 }],
  ["skate-shop-owner-137ca9", 3.9, 0, -3.9, 180, 0.95, "consultorio-4", "sit", "Tenho conseguido lidar melhor com as demandas de casa."],

  // Sala de Psicodrama (Camilly) — Palco livre, semicírculo, almofadas e adereços
  ["meeting-chair-731ce0", 1.15, 0, 4.75, 135, 1.0, "espaco-coletivo"],
  ["meeting-chair-731ce0", 2.05, 0, 5.25, 165, 1.0, "espaco-coletivo"],
  ["meeting-chair-731ce0", 3.45, 0, 5.25, -165, 1.0, "espaco-coletivo"],
  ["meeting-chair-731ce0", 4.35, 0, 4.75, -135, 1.0, "espaco-coletivo"],
  ["meeting-chair-731ce0", 2.75, 0, 2.75, 0, 1.0, "espaco-coletivo"], // Cadeira Vazia (técnica psicodramática)
  ["cushion-121479", 4.75, 0.02, 2.5, -35, 1.25, "espaco-coletivo"],
  ["cushion-121479", 4.85, 0.02, 3.1, -60, 1.25, "espaco-coletivo"],
  ["woven-storage-basket-983d80", 4.8, 0, 1.75, 0, 1.25, "espaco-coletivo"], // Caixa de adereços e tecidos
  ["arc-floor-lamp-fa0b5f", 0.55, 0, 5.35, 45, 1.0, "espaco-coletivo"],
  ["whiteboard-ea98f7", 2.75, 0, 5.85, 180, 1.0, "espaco-coletivo"],
  ["flat-screen-television-97b1f3", 0.22, 1.2, 3.6, 90, 1.0, "espaco-coletivo"],
  ["acoustic-planter-divider-3e9130", 4.9, 0, 3.9, 0, 0.85, "espaco-coletivo"],
  ["wall-clock-05f8ff", 5.38, 0, 3.6, -90, 1.0, "espaco-coletivo"], // Relógio na frente da psicóloga
  ["parent-chaperone-79e535", 1.15, 0, 2.35, 45, 0.95, "espaco-coletivo", "stand", "Camilly: Vamos entrar no palco e experimentar essa cena!", { hair: 0x18181b, top: 0x881337, bottom: 0x1e293b }],
  ["commuter-381e7f", 2.15, 0, 3.65, 90, 0.95, "espaco-coletivo", "stand", "No papel do meu pai, eu diria que também senti medo.", { hair: 0x1e1b18, top: 0x3b82f6, bottom: 0x1f2937 }],
  ["student-with-backpack-65d2b4", 3.35, 0, 3.65, -90, 0.95, "espaco-coletivo", "stand", "Ouvir isso muda tudo na minha percepção!", { hair: 0x92400e, top: 0xd97706, bottom: 0x374151 }],

  // Sanitário Acessível (PCD)
  ["toilet-2edbd9", 7.35, 0, -5.4, 0, 1.0, "sanitario-pcd"],
  ["classroom-sink-unit-26fe09", 6.1, 0, -5.45, 0, 0.9, "sanitario-pcd"],
  ["mirror-cabinet-3cb9fd", 6.1, 0, -5.82, 0, 1.0, "sanitario-pcd"],
  ["hand-sanitiser-dispenser-a48460", 5.65, 0, -2.0, 90, 1.0, "sanitario-pcd"],

  // Copa / Apoio & Resíduos
  ["tea-point-counter-module-1ad43e", 7.2, 0, 4.8, -90, 1.0, "copa-apoio"],
  ["office-coffee-machine-9da5e6", 7.2, 0.92, 4.5, -90, 1.0, "copa-apoio"],
  ["microwave-oven-7f60d4", 7.2, 0.92, 5.2, -90, 1.0, "copa-apoio"],
  ["three-stream-recycling-station-14da24", 6.2, 0, 5.45, 180, 1.0, "copa-apoio"],
];

async function loadModel(assetId) {
  if (modelCache.has(assetId)) return modelCache.get(assetId);
  const gltf = await loader.loadAsync(`./assets/models/${assetId}.glb`);
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
    }
  });
  modelCache.set(assetId, gltf.scene);
  return gltf.scene;
}

function poseCharacter(root, pose) {
  const lArm = root.getObjectByName("LeftArm");
  const rArm = root.getObjectByName("RightArm");
  const lFore = root.getObjectByName("LeftForeArm");
  const rFore = root.getObjectByName("RightForeArm");
  // Lower arms out of T-pose
  if (lArm) lArm.rotation.z = -1.18;
  if (rArm) rArm.rotation.z = 1.18;
  if (lFore) lFore.rotation.x = 0.25;
  if (rFore) rFore.rotation.x = 0.25;

  if (pose === "sit") {
    const hips = root.getObjectByName("Hips");
    const lUp = root.getObjectByName("LeftUpLeg");
    const rUp = root.getObjectByName("RightUpLeg");
    const lLeg = root.getObjectByName("LeftLeg");
    const rLeg = root.getObjectByName("RightLeg");
    if (hips) hips.position.y *= 0.64;
    if (lUp) lUp.rotation.x = -1.45;
    if (rUp) rUp.rotation.x = -1.45;
    if (lLeg) lLeg.rotation.x = 1.45;
    if (rLeg) rLeg.rotation.x = 1.45;
    if (lArm) { lArm.rotation.z = -1.05; lArm.rotation.x = -0.35; }
    if (rArm) { rArm.rotation.z = 1.05; rArm.rotation.x = -0.35; }
  }
}

function recolorMeshPart(node, hexColor) {
  if (!node || !hexColor) return;
  const target = new THREE.Color(hexColor);
  node.traverse((obj) => {
    if (!obj.isMesh || !obj.geometry?.attributes?.color) return;
    const geom = obj.geometry.clone();
    obj.geometry = geom;
    const col = geom.attributes.color;
    for (let i = 0; i < col.count; i++) {
      const r = col.getX(i);
      const g = col.getY(i);
      const b = col.getZ(i);
      // Preserve relative shading while applying the new color
      const lum = Math.max(0.25, Math.min(1.15, (r + g + b) / 1.5));
      col.setXYZ(i, target.r * lum, target.g * lum, target.b * lum);
    }
    col.needsUpdate = true;
  });
}

function customizeCharacter(root, style) {
  if (!style) return;
  if (style.hair) recolorMeshPart(root.getObjectByName("attach-hair"), style.hair);
  if (style.top) {
    recolorMeshPart(root.getObjectByName("attach-top"), style.top);
    recolorMeshPart(root.getObjectByName("attach-coat"), style.top);
  }
  if (style.bottom) recolorMeshPart(root.getObjectByName("attach-bottom"), style.bottom);
}

const animatedCharacters = [];

async function populateClinic() {
  const uniqueIds = [...new Set(PLACEMENTS.map((p) => p[0]))];
  const bar = document.getElementById("loading-bar");
  const status = document.getElementById("loading-status");
  let loaded = 0;

  await Promise.all(
    uniqueIds.map(async (id) => {
      try {
        await loadModel(id);
      } catch (err) {
        console.warn("Falha ao carregar modelo:", id, err);
      } finally {
        loaded++;
        const pct = Math.round((loaded / uniqueIds.length) * 100);
        bar.style.width = `${pct}%`;
        status.textContent = `Carregando Polyfork 3D (${loaded}/${uniqueIds.length})`;
      }
    })
  );

  for (const [id, x, y, z, rotDeg, scale, roomId, pose, line, style] of PLACEMENTS) {
    const template = modelCache.get(id);
    if (!template) continue;
    const instance = SkeletonUtils.clone(template);
    instance.position.set(x, y, z);
    instance.rotation.y = THREE.MathUtils.degToRad(rotDeg);
    instance.scale.setScalar(scale);
    if (pose) {
      poseCharacter(instance, pose);
      customizeCharacter(instance, style);
      // Remove backpacks, briefcases, hats, scarves, and handheld props from characters inside the clinic
      for (const nodeName of [
        "attach-back",
        "attach-back-mesh",
        "attach-hat",
        "attach-hat-mesh",
        "attach-neck",
        "attach-neck-mesh",
        "attach-righthand-mesh",
        "attach-lefthand-mesh",
      ]) {
        const part = instance.getObjectByName(nodeName);
        if (part) part.visible = false;
      }
      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      bubble.textContent = line || "";
      bubble.style.opacity = "0";
      pinsLayer.appendChild(bubble);
      animatedCharacters.push({
        root: instance,
        pose,
        roomId,
        line,
        bubble,
        phase: animatedCharacters.length * 1.37,
        head: instance.getObjectByName("Head"),
        spine: instance.getObjectByName("Spine"),
        lArm: instance.getObjectByName("LeftArm"),
        rArm: instance.getObjectByName("RightArm"),
        lFore: instance.getObjectByName("LeftForeArm"),
        rFore: instance.getObjectByName("RightForeArm"),
      });
    }
    instance.traverse((c) => {
      if (c.isMesh) {
        c.userData.roomId = roomId;
        clickableMeshes.push(c);
      }
    });
    scene.add(instance);
  }

  document.getElementById("loading-overlay").classList.add("hidden");
}

// ============================================================
// 4. UI: Room Pins, Drawer, Bottom Nav & Modal
// ============================================================
const pinsLayer = document.getElementById("pins-layer");
const roomNav = document.getElementById("room-nav");
const drawer = document.getElementById("info-drawer");
const pinElements = new Map();
const navButtons = new Map();
let activeRoomId = null;

function fillList(elId, items) {
  const ul = document.getElementById(elId);
  ul.innerHTML = "";
  for (const text of items) {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  }
}

// Camera fly-to animation state
let flyAnim = null;

function selectRoom(roomId, flyTo = true) {
  const room = ROOMS.find((r) => r.id === roomId);
  if (!room) return;
  activeRoomId = roomId;

  // Update active states
  for (const [id, el] of pinElements) el.classList.toggle("active", id === roomId);
  for (const [id, btn] of navButtons) btn.classList.toggle("active", id === roomId);

  // Fill drawer
  document.getElementById("drawer-category").textContent = room.category;
  document.getElementById("drawer-title").textContent = room.name;
  document.getElementById("drawer-area").textContent = `Área: ${room.area}`;
  document.getElementById("drawer-summary").textContent = room.summary;
  fillList("list-acolhimento", room.acolhimento);
  fillList("list-acessibilidade", room.acessibilidade);
  fillList("list-prefeitura", room.normas.prefeitura);
  fillList("list-anvisa", room.normas.anvisa);
  fillList("list-cfp", room.normas.cfp);
  drawer.classList.remove("hidden");

  if (flyTo) {
    flyAnim = {
      startPos: camera.position.clone(),
      endPos: new THREE.Vector3(room.cameraPos.x, room.cameraPos.y, room.cameraPos.z),
      startTarget: controls.target.clone(),
      endTarget: new THREE.Vector3(room.cameraTarget.x, room.cameraTarget.y, room.cameraTarget.z),
      t: 0,
    };
    if (navMode === "free") {
      // Also orient free-cam smoothly
      const dir = new THREE.Vector3().subVectors(flyAnim.endTarget, flyAnim.endPos).normalize();
      freeYaw = Math.atan2(-dir.x, -dir.z);
      freePitch = Math.asin(THREE.MathUtils.clamp(dir.y, -0.95, 0.95));
    }
  }
}

for (const room of ROOMS) {
  // Floating 3D Pin
  const pin = document.createElement("button");
  pin.className = "pin-marker";
  pin.innerHTML = `<span class="pin-dot" style="background:${room.badgeColor}"></span><span>${room.shortLabel}</span>`;
  pin.addEventListener("click", (e) => {
    e.stopPropagation();
    selectRoom(room.id, true);
  });
  pinsLayer.appendChild(pin);
  pinElements.set(room.id, pin);

  // Bottom Nav Button
  const btn = document.createElement("button");
  btn.className = "room-btn";
  btn.innerHTML = `<span class="room-dot" style="background:${room.badgeColor}"></span><span>${room.shortLabel}</span>`;
  btn.addEventListener("click", () => selectRoom(room.id, true));
  roomNav.appendChild(btn);
  navButtons.set(room.id, btn);
}

document.getElementById("btn-close-drawer").addEventListener("click", () => {
  drawer.classList.add("hidden");
  activeRoomId = null;
  for (const [, el] of pinElements) el.classList.remove("active");
  for (const [, btn] of navButtons) btn.classList.remove("active");
});

// Drawer segmented tabs
const drawerTabs = document.querySelectorAll(".drawer-tab");
const tabPanels = document.querySelectorAll(".tab-panel");
for (const tab of drawerTabs) {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    for (const t of drawerTabs) {
      const active = t.dataset.tab === target;
      t.classList.toggle("active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    }
    for (const p of tabPanels) {
      p.classList.toggle("active", p.dataset.panel === target);
    }
  });
}

const normsModal = document.getElementById("norms-modal");
document.getElementById("btn-norms-overview").addEventListener("click", () => normsModal.classList.remove("hidden"));
document.getElementById("btn-close-modal").addEventListener("click", () => normsModal.classList.add("hidden"));
normsModal.addEventListener("click", (e) => {
  if (e.target === normsModal) normsModal.classList.add("hidden");
});

// Toggle NBR 9050 guides
const btnGuides = document.getElementById("btn-toggle-zones");
let showGuides = true;
btnGuides.addEventListener("click", () => {
  showGuides = !showGuides;
  nbrGuidesGroup.visible = showGuides;
  pinsLayer.classList.toggle("hidden", !showGuides);
  btnGuides.classList.toggle("active", showGuides);
});

// ============================================================
// 5. Navigation Modes: Orbit (Maquete) vs Free Camera (WASD)
// ============================================================
let navMode = "orbit"; // "orbit" | "free"
const btnOrbit = document.getElementById("btn-mode-orbit");
const btnFree = document.getElementById("btn-mode-free");
const hintEl = document.getElementById("controls-hint");

let freeYaw = 0;
let freePitch = -0.15;
const keysPressed = new Set();

function setNavMode(mode) {
  navMode = mode;
  btnOrbit.classList.toggle("active", mode === "orbit");
  btnFree.classList.toggle("active", mode === "free");

  if (mode === "free") {
    controls.enabled = false;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    freeYaw = Math.atan2(-dir.x, -dir.z);
    freePitch = Math.asin(THREE.MathUtils.clamp(dir.y, -0.95, 0.95));
    // If high above, gently lower to human eye level inside/near clinic
    if (camera.position.y > 6) {
      camera.position.set(0, 1.65, 9.8);
      freeYaw = 0;
      freePitch = -0.05;
    }
    hintEl.innerHTML =
      "<strong>Câmera Livre:</strong> <code>WASD</code> para andar · <code>E/Q</code> altura · Arraste para olhar";
  } else {
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(freePitch, freeYaw, 0, "YXZ"));
    controls.target.copy(camera.position).addScaledVector(forward, 5);
    controls.enabled = true;
    hintEl.textContent = "Arraste para girar · Scroll para zoom · Clique nos ambientes";
  }
}

btnOrbit.addEventListener("click", () => setNavMode("orbit"));
btnFree.addEventListener("click", () => setNavMode("free"));

window.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  const code = e.code;
  keysPressed.add(code);
  if (code === "KeyF") {
    setNavMode(navMode === "orbit" ? "free" : "orbit");
  }
});
window.addEventListener("keyup", (e) => keysPressed.delete(e.code));

// Mouse drag look in Free-Cam + Raycast click detection
let isDragging = false;
let pointerDownPos = { x: 0, y: 0 };
let lastPointer = { x: 0, y: 0 };

canvas.addEventListener("pointerdown", (e) => {
  isDragging = true;
  pointerDownPos = { x: e.clientX, y: e.clientY };
  lastPointer = { x: e.clientX, y: e.clientY };
});

window.addEventListener("pointermove", (e) => {
  if (!isDragging || navMode !== "free") return;
  const dx = e.clientX - lastPointer.x;
  const dy = e.clientY - lastPointer.y;
  lastPointer = { x: e.clientX, y: e.clientY };
  freeYaw -= dx * 0.0042;
  freePitch = THREE.MathUtils.clamp(freePitch - dy * 0.0042, -Math.PI * 0.46, Math.PI * 0.46);
  flyAnim = null;
});

window.addEventListener("pointerup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
  if (dist < 5 && e.target === canvas) {
    handleSceneClick(e);
  }
});

// Raycasting to click any room/furniture
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();

function handleSceneClick(e) {
  const rect = canvas.getBoundingClientRect();
  ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObjects(clickableMeshes, false);
  if (hits.length > 0) {
    const roomId = hits[0].object.userData.roomId;
    if (roomId) selectRoom(roomId, navMode === "orbit");
  }
}

// ============================================================
// 6. Render Loop & Pin Projection
// ============================================================
const clock = new THREE.Clock();
const projVec = new THREE.Vector3();

function updatePins() {
  if (!showGuides) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  for (const room of ROOMS) {
    const el = pinElements.get(room.id);
    if (!el) continue;
    projVec.set(room.position.x, room.position.y + 1.0, room.position.z);
    projVec.project(camera);
    if (projVec.z > 1) {
      el.style.display = "none";
    } else {
      el.style.display = "inline-flex";
      const sx = (projVec.x * 0.5 + 0.5) * w;
      const sy = (-projVec.y * 0.5 + 0.5) * h;
      el.style.left = `${sx}px`;
      el.style.top = `${sy}px`;
    }
  }
}

function updateCharacters(elapsed) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const activeSpeakerSlot = Math.floor(elapsed / 3.5);

  for (let i = 0; i < animatedCharacters.length; i++) {
    const ch = animatedCharacters[i];
    const t = elapsed + ch.phase;

    // Subtle breathing and idle motion
    if (ch.spine) ch.spine.rotation.x = Math.sin(t * 2.1) * 0.035;

    // Find nearest neighbor in same room (< 2.8m) to look/talk to
    let hasNeighbor = false;
    let nearestYaw = 0;
    let minD = 2.8;
    for (let j = 0; j < animatedCharacters.length; j++) {
      if (i === j) continue;
      const other = animatedCharacters[j];
      const dist = ch.root.position.distanceTo(other.root.position);
      if (dist < minD) {
        minD = dist;
        hasNeighbor = true;
        const dx = other.root.position.x - ch.root.position.x;
        const dz = other.root.position.z - ch.root.position.z;
        const worldAngle = Math.atan2(dx, dz);
        let rel = worldAngle - ch.root.rotation.y;
        while (rel > Math.PI) rel -= Math.PI * 2;
        while (rel < -Math.PI) rel += Math.PI * 2;
        nearestYaw = THREE.MathUtils.clamp(rel * 0.45, -0.55, 0.55);
      }
    }

    const isSpeaking = hasNeighbor && (activeSpeakerSlot % animatedCharacters.length === i || (activeSpeakerSlot + 5) % animatedCharacters.length === i);

    if (ch.head) {
      ch.head.rotation.y = hasNeighbor ? nearestYaw + Math.sin(t * 1.4) * 0.12 : Math.sin(t * 0.9) * 0.08;
      ch.head.rotation.x = isSpeaking ? Math.sin(t * 5.2) * 0.08 : Math.sin(t * 1.5) * 0.03;
    }

    if (ch.lFore && ch.rFore) {
      const gesture = isSpeaking ? Math.sin(t * 4.5) * 0.28 : Math.sin(t * 1.4) * 0.05;
      ch.lFore.rotation.x = 0.25 + gesture;
      ch.rFore.rotation.x = 0.25 - gesture * 0.8;
    }

    // Update speech bubble position
    if (ch.bubble) {
      if (isSpeaking && ch.line && showGuides) {
        projVec.set(ch.root.position.x, ch.root.position.y + (ch.pose === "sit" ? 1.55 : 1.9), ch.root.position.z);
        projVec.project(camera);
        const camDist = camera.position.distanceTo(ch.root.position);
        if (projVec.z <= 1 && camDist < 18) {
          ch.bubble.style.display = "block";
          ch.bubble.style.opacity = "1";
          ch.bubble.style.left = `${(projVec.x * 0.5 + 0.5) * w}px`;
          ch.bubble.style.top = `${(-projVec.y * 0.5 + 0.5) * h}px`;
        } else {
          ch.bubble.style.opacity = "0";
          ch.bubble.style.display = "none";
        }
      } else {
        ch.bubble.style.opacity = "0";
        ch.bubble.style.display = "none";
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;

  if (flyAnim) {
    flyAnim.t = Math.min(1, flyAnim.t + dt * 1.9);
    const ease = 1 - Math.pow(1 - flyAnim.t, 3);
    camera.position.lerpVectors(flyAnim.startPos, flyAnim.endPos, ease);
    controls.target.lerpVectors(flyAnim.startTarget, flyAnim.endTarget, ease);
    if (flyAnim.t >= 1) flyAnim = null;
  }

  if (navMode === "orbit") {
    controls.update();
  } else {
    // Free camera movement
    const euler = new THREE.Euler(freePitch, freeYaw, 0, "YXZ");
    camera.quaternion.setFromEuler(euler);

    const speed = 5.2 * dt;
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(new THREE.Euler(0, freeYaw, 0));
    const right = new THREE.Vector3(1, 0, 0).applyEuler(new THREE.Euler(0, freeYaw, 0));

    if (keysPressed.has("KeyW") || keysPressed.has("ArrowUp")) camera.position.addScaledVector(forward, speed);
    if (keysPressed.has("KeyS") || keysPressed.has("ArrowDown")) camera.position.addScaledVector(forward, -speed);
    if (keysPressed.has("KeyD") || keysPressed.has("ArrowRight")) camera.position.addScaledVector(right, speed);
    if (keysPressed.has("KeyA") || keysPressed.has("ArrowLeft")) camera.position.addScaledVector(right, -speed);
    if (keysPressed.has("KeyE") || keysPressed.has("Space")) camera.position.y += speed * 0.75;
    if (keysPressed.has("KeyQ") || keysPressed.has("ShiftLeft")) camera.position.y = Math.max(0.5, camera.position.y - speed * 0.75);
  }

  updateCharacters(elapsed);
  updatePins();
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

populateClinic();
animate();
