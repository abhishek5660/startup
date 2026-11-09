/**
 * Hero WebGL scene (plain three.js, no React).
 * The logo's pixel cluster as glossy 3D cubes, circled by the logo's orbit ring,
 * with a floating "frontend" browser and "backend" server panel and a depth field of tiny cubes.
 * Loaded on demand by Hero3D so three.js stays out of the first-paint bundle.
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type HeroScene = {
  setPointer: (x: number, y: number) => void;
  setScroll: (p: number) => void;
  dispose: () => void;
};

const BRAND = ["#18b4ff", "#1e6bff", "#5b33f0", "#8b2cf5"];

// Same cluster as the <Pixels> SVG motif (48×52 grid).
const SQUARES = [
  { x: 20, y: 0, c: "#18b4ff", s: 10 },
  { x: 36, y: 12, c: "#18b4ff", s: 7 },
  { x: 4, y: 14, c: "#1e6bff", s: 10 },
  { x: 26, y: 24, c: "#6a2cf5", s: 8 },
  { x: 0, y: 30, c: "#5b33f0", s: 10 },
  { x: 13, y: 42, c: "#8b2cf5", s: 8 },
];

const LOGS = [
  ["GET", "/api/projects", "200", "18ms"],
  ["POST", "/api/contact", "201", "42ms"],
  ["GET", "/api/services", "200", "9ms"],
  ["PUT", "/api/profile", "200", "27ms"],
];

const FONT = '"Inter Variable", Inter, system-ui, sans-serif';
const MONO = 'ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace';

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawBrowser(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.clearRect(0, 0, W, H);
  // body
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "rgba(40,52,130,0.92)");
  bg.addColorStop(1, "rgba(14,20,64,0.92)");
  roundRect(ctx, 2, 2, W - 4, H - 4, 34);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.stroke();
  // top bar
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(38 + i * 26, 38, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  roundRect(ctx, 130, 24, W - 170, 28, 10);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = `500 17px ${FONT}`;
  ctx.fillText("your-business.com", 146, 44);
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(0, 74, W, 2);
  // nav
  roundRect(ctx, 34, 98, 80, 14, 6);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fill();
  for (let i = 0; i < 3; i++) {
    roundRect(ctx, W - 190 + i * 54, 101, 40, 9, 4);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fill();
  }
  // hero banner with moving sheen
  const bx = 34, by = 130, bw = W - 68, bh = 150;
  ctx.save();
  roundRect(ctx, bx, by, bw, bh, 18);
  ctx.clip();
  const g = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
  g.addColorStop(0, "#18b4ff");
  g.addColorStop(0.45, "#1e6bff");
  g.addColorStop(1, "#8b2cf5");
  ctx.fillStyle = g;
  ctx.fillRect(bx, by, bw, bh);
  const sx = bx - 200 + ((t * 160) % (bw + 400));
  const sh = ctx.createLinearGradient(sx, 0, sx + 160, 0);
  sh.addColorStop(0, "rgba(255,255,255,0)");
  sh.addColorStop(0.5, "rgba(255,255,255,0.35)");
  sh.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sh;
  ctx.fillRect(bx, by, bw, bh);
  ctx.restore();
  ctx.fillStyle = "#fff";
  ctx.font = `800 30px ${FONT}`;
  ctx.fillText("Grow online.", bx + 24, by + bh - 52);
  roundRect(ctx, bx + 24, by + bh - 36, 120, 12, 6);
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.fill();
  // cards
  const cw = (bw - 32) / 3;
  for (let i = 0; i < 3; i++) {
    const a = 0.08 + 0.08 * (0.5 + 0.5 * Math.sin(t * 2.4 - i * 0.8));
    roundRect(ctx, bx + i * (cw + 16), by + bh + 22, cw, 62, 12);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fill();
  }
  // buttons
  const bg2 = ctx.createLinearGradient(bx, 0, bx + 120, 0);
  bg2.addColorStop(0, "#1e6bff");
  bg2.addColorStop(1, "#8b2cf5");
  roundRect(ctx, bx, H - 64, 120, 34, 17);
  ctx.fillStyle = bg2;
  ctx.fill();
  roundRect(ctx, bx + 134, H - 64, 92, 34, 17);
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 2;
  ctx.stroke();
  // label
  roundRect(ctx, W - 160, H - 62, 126, 30, 8);
  ctx.fillStyle = "rgba(6,10,36,0.75)";
  ctx.fill();
  ctx.fillStyle = "#18b4ff";
  ctx.font = `600 17px ${MONO}`;
  ctx.fillText("</> frontend", W - 148, H - 41);
}

function drawServer(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, tick: number) {
  ctx.clearRect(0, 0, W, H);
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "rgba(52,36,128,0.93)");
  bg.addColorStop(1, "rgba(12,16,56,0.93)");
  roundRect(ctx, 2, 2, W - 4, H - 4, 30);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.stroke();
  ctx.font = `600 19px ${MONO}`;
  ctx.fillStyle = "#c4b5fd";
  ctx.fillText("{ } backend", 28, 44);
  const pulse = 0.5 + 0.5 * Math.sin(t * 4);
  ctx.fillStyle = `rgba(52,211,153,${0.25 + pulse * 0.3})`;
  ctx.beginPath();
  ctx.arc(W - 104, 38, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#34d399";
  ctx.beginPath();
  ctx.arc(W - 104, 38, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `500 17px ${FONT}`;
  ctx.fillStyle = "#6ee7b7";
  ctx.fillText("online", W - 88, 44);
  // server rows
  for (let i = 0; i < 3; i++) {
    const y = 66 + i * 44;
    roundRect(ctx, 24, y, W - 48, 34, 9);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = `rgba(24,180,255,${0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * (3 + i)))})`;
    ctx.fillRect(40, y + 13, 9, 9);
    ctx.fillStyle = `rgba(139,44,245,${0.3 + 0.7 * (0.5 + 0.5 * Math.cos(t * (2.2 + i)))})`;
    ctx.fillRect(56, y + 13, 9, 9);
    roundRect(ctx, W / 2, y + 15, W / 2 - 44, 5, 3);
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fill();
  }
  // logs
  ctx.font = `500 17px ${MONO}`;
  for (let k = 0; k < 3; k++) {
    const l = LOGS[(tick + k) % LOGS.length];
    const y = 222 + k * 28;
    ctx.globalAlpha = 1 - k * 0.28;
    ctx.fillStyle = "#18b4ff";
    ctx.fillText(l[0], 28, y);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(l[1], 90, y);
    ctx.fillStyle = "#6ee7b7";
    ctx.fillText(l[2], W - 136, y);
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillText(l[3], W - 84, y);
  }
  ctx.globalAlpha = 1;
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(159,225,255,0.85)");
  g.addColorStop(0.5, "rgba(30,107,255,0.25)");
  g.addColorStop(1, "rgba(30,107,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createHeroScene(canvas: HTMLCanvasElement, opts: { reduce: boolean; introDelay: number }): HeroScene {
  const { reduce } = opts;
  const mobile = window.innerWidth < 768;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 11.2);

  // Lights in brand colours for coloured rim highlights
  scene.add(new THREE.AmbientLight("#8aa0ff", 0.35));
  const key = new THREE.DirectionalLight("#ffffff", 1.6);
  key.position.set(3, 5, 6);
  scene.add(key);
  const rimA = new THREE.PointLight("#18b4ff", 30, 20);
  rimA.position.set(-4, 2, 2);
  scene.add(rimA);
  const rimB = new THREE.PointLight("#8b2cf5", 34, 20);
  rimB.position.set(4, -2.5, 1.5);
  scene.add(rimB);

  const root = new THREE.Group();
  scene.add(root);
  const disposables: { dispose: () => void }[] = [envTex, pmrem];

  // ── Logo cubes ──────────────────────────────────────────────
  const logo = new THREE.Group();
  root.add(logo);
  const k = 0.062;
  const cubes: { mesh: THREE.Mesh; base: THREE.Vector3; phase: number; spin: number }[] = [];
  SQUARES.forEach((q, i) => {
    const size = q.s * k;
    const geo = new RoundedBoxGeometry(size, size, size, 4, size * 0.16);
    const mat = new THREE.MeshPhysicalMaterial({
      color: q.c,
      metalness: 0.25,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: new THREE.Color(q.c),
      emissiveIntensity: 0.22,
    });
    disposables.push(geo, mat);
    const mesh = new THREE.Mesh(geo, mat);
    const base = new THREE.Vector3((q.x + q.s / 2 - 24) * k, -(q.y + q.s / 2 - 26) * k, ((i % 3) - 1) * 0.35);
    mesh.position.copy(base);
    logo.add(mesh);
    cubes.push({ mesh, base, phase: i * 1.1, spin: (i % 2 ? 1 : -1) * (0.15 + i * 0.03) });
  });
  logo.rotation.set(-0.15, 0.45, 0);

  // ── Orbit ring (the logo's swoosh) ──────────────────────────
  const orbit = new THREE.Group();
  orbit.rotation.set(1.22, 0.18, -0.32);
  root.add(orbit);
  const R = 2.75;
  const ringGeo = new THREE.TorusGeometry(R, 0.055, 20, 240);
  {
    const pos = ringGeo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    const stops = [new THREE.Color("#0a1033"), new THREE.Color("#5b33f0"), new THREE.Color("#1e6bff"), new THREE.Color("#18b4ff")];
    for (let i = 0; i < pos.count; i++) {
      const a = (Math.atan2(pos.getY(i), pos.getX(i)) + Math.PI) / (Math.PI * 2);
      const f = a * (stops.length - 1);
      const idx = Math.min(Math.floor(f), stops.length - 2);
      c.copy(stops[idx]).lerp(stops[idx + 1], f - idx);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    ringGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }
  const ringMat = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.4, roughness: 0.25, emissive: "#1e3bff", emissiveIntensity: 0.35 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  orbit.add(ring);
  disposables.push(ringGeo, ringMat);

  // dotted outer ring
  const dotCount = 160;
  const dotPos = new Float32Array(dotCount * 3);
  for (let i = 0; i < dotCount; i++) {
    const a = (i / dotCount) * Math.PI * 2;
    dotPos.set([Math.cos(a) * (R + 0.55), Math.sin(a) * (R + 0.55), 0], i * 3);
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPos, 3));
  const dotMat = new THREE.PointsMaterial({ color: "#7aa2ff", size: 0.035, transparent: true, opacity: 0.55, sizeAttenuation: true });
  orbit.add(new THREE.Points(dotGeo, dotMat));
  disposables.push(dotGeo, dotMat);

  // travelling light on the ring
  const gTex = glowTexture();
  const glowMat = new THREE.SpriteMaterial({ map: gTex, color: "#ffffff", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.set(0.9, 0.9, 1);
  orbit.add(glow);
  disposables.push(gTex, glowMat);

  // ── Floating panels ─────────────────────────────────────────
  function panel(w: number, h: number, cw: number, ch: number) {
    const c = document.createElement("canvas");
    c.width = cw;
    c.height = ch;
    const ctx = c.getContext("2d")!;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const group = new THREE.Group();
    const backGeo = new RoundedBoxGeometry(w, h, 0.08, 4, 0.12);
    const backMat = new THREE.MeshPhysicalMaterial({ color: "#121a4f", metalness: 0.5, roughness: 0.3, clearcoat: 1, transparent: true, opacity: 0.85 });
    group.add(new THREE.Mesh(backGeo, backMat));
    const faceGeo = new THREE.PlaneGeometry(w, h);
    const faceMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false });
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.z = 0.045;
    group.add(face);
    disposables.push(tex, backGeo, backMat, faceGeo, faceMat);
    return { group, ctx, tex, cw, ch };
  }
  const browser = panel(2.9, 2.175, 768, 576);
  browser.group.position.set(-1.6, 1.0, -1.1);
  browser.group.rotation.set(0.05, 0.38, -0.05);
  root.add(browser.group);
  const server = panel(2.5, 1.5625, 640, 400);
  server.group.position.set(1.5, -1.25, 0.9);
  server.group.rotation.set(-0.04, -0.34, 0.04);
  root.add(server.group);

  // data link between panels: a curved tube with a moving packet
  const linkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.9, -0.1, -0.9),
    new THREE.Vector3(-1.4, -1.3, -0.1),
    new THREE.Vector3(0.0, -1.7, 0.5),
    new THREE.Vector3(0.3, -1.3, 0.9),
  ]);
  const linkGeo = new THREE.TubeGeometry(linkCurve, 60, 0.012, 8, false);
  const linkMat = new THREE.MeshBasicMaterial({ color: "#6f8dff", transparent: true, opacity: 0.6 });
  root.add(new THREE.Mesh(linkGeo, linkMat));
  const packetMat = new THREE.SpriteMaterial({ map: gTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const packet = new THREE.Sprite(packetMat);
  packet.scale.set(0.45, 0.45, 1);
  root.add(packet);
  disposables.push(linkGeo, linkMat, packetMat);

  // ── Depth field of tiny cubes ───────────────────────────────
  const fieldCount = mobile ? 70 : 160;
  const fGeo = new THREE.BoxGeometry(1, 1, 1);
  const fMat = new THREE.MeshStandardMaterial({ metalness: 0.3, roughness: 0.4, emissive: "#1e3bff", emissiveIntensity: 0.4 });
  const field = new THREE.InstancedMesh(fGeo, fMat, fieldCount);
  const dummy = new THREE.Object3D();
  const col = new THREE.Color();
  const fieldData: { p: THREE.Vector3; s: number; r: THREE.Euler; v: number }[] = [];
  for (let i = 0; i < fieldCount; i++) {
    const r = 3.6 + Math.random() * 5.5;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const p = new THREE.Vector3(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.7, r * Math.cos(ph) - 2.5);
    const s = Math.random() < 0.12 ? 0.11 : 0.03 + Math.random() * 0.05;
    fieldData.push({ p, s, r: new THREE.Euler(Math.random() * 3, Math.random() * 3, 0), v: 0.2 + Math.random() * 0.6 });
    field.setColorAt(i, col.set(BRAND[i % BRAND.length]));
  }
  root.add(field);
  disposables.push(fGeo, fMat);

  const updateField = (t: number) => {
    for (let i = 0; i < fieldCount; i++) {
      const d = fieldData[i];
      dummy.position.set(d.p.x, d.p.y + Math.sin(t * d.v + i) * 0.12, d.p.z);
      dummy.rotation.set(d.r.x + t * d.v * 0.5, d.r.y + t * d.v * 0.4, 0);
      dummy.scale.setScalar(d.s);
      dummy.updateMatrix();
      field.setMatrixAt(i, dummy.matrix);
    }
    field.instanceMatrix.needsUpdate = true;
  };

  // ── Interaction state ───────────────────────────────────────
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let scroll = 0;
  let tick = 0;
  let lastTick = 0;

  const resize = () => {
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole composition in frame on narrow (portrait) boxes
    camera.position.z = w / h < 1 ? 11.2 / Math.max(w / h, 0.7) : 11.2;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  if (canvas.parentElement) ro.observe(canvas.parentElement);

  const clock = new THREE.Clock();
  const start = performance.now() + opts.introDelay * 1000;
  const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 4);

  const frame = () => {
    const t = clock.getElapsedTime();
    const intro = reduce ? 1 : easeOut((performance.now() - start) / 1800);

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    root.rotation.y = pointer.x * 0.32 + scroll * 0.6 + (1 - intro) * -0.9;
    root.rotation.x = pointer.y * 0.18 - scroll * 0.25;
    root.position.y = scroll * 0.8;
    const sc = 0.55 + intro * 0.45;
    root.scale.setScalar(sc);

    if (!reduce) {
      cubes.forEach((c) => {
        c.mesh.position.y = c.base.y + Math.sin(t * 1.1 + c.phase) * 0.07;
        c.mesh.position.z = c.base.z + Math.cos(t * 0.8 + c.phase) * 0.08;
        c.mesh.rotation.x = t * c.spin * 0.6;
        c.mesh.rotation.y = t * c.spin;
      });
      logo.rotation.y = 0.45 + Math.sin(t * 0.4) * 0.35;
      ring.rotation.z = t * 0.12;
      browser.group.position.y = 1.0 + Math.sin(t * 0.9) * 0.08;
      server.group.position.y = -1.25 + Math.sin(t * 0.9 + 1.7) * 0.08;
      field.rotation.y = t * 0.025;
    }
    const a = reduce ? 0.6 : t * 0.9;
    glow.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
    packet.position.copy(linkCurve.getPoint(reduce ? 0.5 : (t * 0.45) % 1));
    updateField(reduce ? 0 : t);

    // panel textures: animate at ~20fps to keep it cheap
    if (t - lastTick > 0.05 || reduce) {
      lastTick = t;
      tick = Math.floor(t / 1.8);
      drawBrowser(browser.ctx, browser.cw, browser.ch, t);
      browser.tex.needsUpdate = true;
      drawServer(server.ctx, server.cw, server.ch, t, tick);
      server.tex.needsUpdate = true;
    }

    renderer.render(scene, camera);
  };

  let raf = 0;
  let running = false;
  let visible = true;
  const loop = () => {
    frame();
    if (running) raf = requestAnimationFrame(loop);
  };
  const play = () => {
    if (running || reduce || !visible || document.hidden) return;
    running = true;
    clock.start();
    loop();
  };
  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) play();
    else pause();
  });
  io.observe(canvas);
  const onVis = () => (document.hidden ? pause() : play());
  document.addEventListener("visibilitychange", onVis);

  // Draw once so something shows even before the first animation frame / with reduced motion.
  frame();
  play();
  // Redraw panel text once web fonts are ready.
  document.fonts?.ready.then(() => frame());

  return {
    setPointer(x, y) {
      pointer.tx = x;
      pointer.ty = y;
      if (reduce) frame();
    },
    setScroll(p) {
      scroll = p;
      if (reduce) frame();
    },
    dispose() {
      pause();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      disposables.forEach((d) => d.dispose());
      field.dispose();
      renderer.dispose();
    },
  };
}
