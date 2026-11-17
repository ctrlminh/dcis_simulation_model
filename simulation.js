let simStage = "healthy"; // "healthy" | "dcis" | "idc"
let showInterferon = true;

let myoCells = [];
let luminalCells = [];
let dcisCells = [];
let ifnParticles = [];

const CELL_INFO = {
  membrane: {
    badge: "Structural Boundary",
    title: "Basement Membrane",
    desc: "A thin, specialized extracellular matrix surrounding the breast duct. In <strong>Stage 0 DCIS</strong>, this wall remains completely intact, preventing abnormal cells from reaching blood vessels or lymphatics."
  },
  myoepithelial: {
    badge: "Tumor Suppressor Layer",
    title: "Myoepithelial Cells (MECs)",
    desc: "Contractile cells forming a protective ring between luminal cells and the basement membrane. Research shows MECs actively suppress tumor invasion and maintain ductal polarity."
  },
  luminal: {
    badge: "Inner Duct Lining",
    title: "Luminal Epithelial Cells",
    desc: "The inner layer of cells lining the central lumen of the breast duct. Most breast cancers, including DCIS, originate from abnormal proliferation of luminal epithelial cells."
  },
  dcis: {
    badge: "Stage 0 Pre-Invasive",
    title: "DCIS Proliferating Cells",
    desc: "Abnormal epithelial cells multiplying inside the ductal lumen. Although confined behind the basement membrane, spatial transcriptomics reveals distinct cellular neighborhoods and immune interactions."
  },
  interferon: {
    badge: "Immune Microenvironment",
    title: "IFN-α & IFN-γ Signaling",
    desc: "Interferon-alpha and interferon-gamma pathways regulate immune surveillance in the stromal tumor microenvironment around the duct—a key focus of spatial transcriptomics research."
  }
};

function setup() {
  const container = document.getElementById("p5-canvas-container");
  const w = Math.min(container.offsetWidth || 560, 580);
  const canvas = createCanvas(w, 460);
  canvas.parent("p5-canvas-container");
  buildDuctCells();
}

function buildDuctCells() {
  myoCells = [];
  luminalCells = [];
  dcisCells = [];
  ifnParticles = [];

  const cx = width / 2;
  const cy = height / 2;
  const myoRadius = 152;
  const luminalRadius = 128;

  // Ring of Myoepithelial Cells
  const numMyo = 24;
  for (let i = 0; i < numMyo; i++) {
    const angle = (TWO_PI / numMyo) * i;
    myoCells.push({
      angle,
      r: myoRadius,
      x: cx + cos(angle) * myoRadius,
      y: cy + sin(angle) * myoRadius,
      breached: simStage === "idc" && i >= 2 && i <= 5
    });
  }

  // Ring of Luminal Epithelial Cells
  const numLuminal = 24;
  for (let i = 0; i < numLuminal; i++) {
    const angle = (TWO_PI / numLuminal) * i + 0.1;
    luminalCells.push({
      angle,
      r: luminalRadius,
      x: cx + cos(angle) * luminalRadius,
      y: cy + sin(angle) * luminalRadius
    });
  }

  // Abnormal DCIS Cells inside the lumen
  if (simStage === "dcis" || simStage === "idc") {
    for (let i = 0; i < 42; i++) {
      const a = random(TWO_PI);
      const distFromCenter = random(12, 102);
      dcisCells.push({
        baseX: cx + cos(a) * distFromCenter,
        baseY: cy + sin(a) * distFromCenter,
        offset: random(100),
        escaped: false
      });
    }
  }

  // Escaping cells for Invasive (IDC) demonstration
  if (simStage === "idc") {
    for (let i = 0; i < 10; i++) {
      dcisCells.push({
        baseX: cx + random(155, 215),
        baseY: cy + random(55, 135),
        offset: random(100),
        escaped: true
      });
    }
  }

  // Stromal IFN-alpha / IFN-gamma signals outside the duct
  for (let i = 0; i < 28; i++) {
    const a = random(TWO_PI);
    const distFromCenter = random(180, 225);
    ifnParticles.push({
      cx,
      cy,
      angle: a,
      dist: distFromCenter,
      speed: random(0.003, 0.008) * (random() > 0.5 ? 1 : -1),
      type: i % 2 === 0 ? "IFN-α" : "IFN-γ",
      x: 0,
      y: 0
    });
  }
}

function draw() {
  background(250, 251, 253);
  const cx = width / 2;
  const cy = height / 2;

  // Stromal label
  fill(100, 116, 139);
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);
  text("Stromal Microenvironment (Fibroblasts & Immune Cells)", 16, 16);

  // 1. Basement Membrane Ring
  noFill();
  stroke(51, 65, 85);
  strokeWeight(6);
  if (simStage === "idc") {
    // Draw breached arc in IDC state
    arc(cx, cy, 336, 336, 1.15, TWO_PI + 0.35);
  } else {
    ellipse(cx, cy, 336, 336);
  }

  // 2. Myoepithelial Cells (Teal)
  for (let cell of myoCells) {
    if (cell.breached) continue;
    const pulse = sin(frameCount * 0.04 + cell.angle * 3) * 1.5;
    fill(13, 148, 136);
    stroke(255);
    strokeWeight(1.5);
    ellipse(cell.x + pulse, cell.y + pulse, 22, 16);
  }

  // 3. Luminal Epithelial Cells (Blue)
  for (let cell of luminalCells) {
    fill(59, 130, 246);
    stroke(255);
    strokeWeight(1.5);
    ellipse(cell.x, cell.y, 20, 20);
  }

  // 4. DCIS / IDC Cells (Magenta)
  for (let cell of dcisCells) {
    const wobbleX = sin(frameCount * 0.03 + cell.offset) * 2.5;
    const wobbleY = cos(frameCount * 0.03 + cell.offset) * 2.5;
    cell.currX = cell.baseX + wobbleX;
    cell.currY = cell.baseY + wobbleY;

    fill(cell.escaped ? color(190, 18, 60) : color(219, 39, 119, 220));
    stroke(255);
    strokeWeight(1.2);
    ellipse(cell.currX, cell.currY, 22, 22);
  }

  // 5. Interferon Signaling Particles (Amber)
  if (showInterferon) {
    for (let p of ifnParticles) {
      p.angle += p.speed;
      p.x = p.cx + cos(p.angle) * p.dist;
      p.y = p.cy + sin(p.angle) * p.dist;

      fill(245, 158, 11);
      noStroke();
      ellipse(p.x, p.y, 9, 9);
    }
  }

  // Center Lumen Label in Healthy Mode
  if (simStage === "healthy") {
    fill(100, 116, 139);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(13);
    text("Open Ductal Lumen\n(Click any cell ring)", cx, cy);
  }
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  const cx = width / 2;
  const cy = height / 2;

  // Check Interferon clicks
  if (showInterferon) {
    for (let p of ifnParticles) {
      if (dist(mouseX, mouseY, p.x, p.y) < 12) {
        window.updateInspector(CELL_INFO.interferon.badge, CELL_INFO.interferon.title, CELL_INFO.interferon.desc);
        return;
      }
    }
  }

  // Check DCIS cells
  for (let cell of dcisCells) {
    if (dist(mouseX, mouseY, cell.currX, cell.currY) < 14) {
      window.updateInspector(CELL_INFO.dcis.badge, CELL_INFO.dcis.title, CELL_INFO.dcis.desc);
      return;
    }
  }

  // Check Luminal cells
  for (let cell of luminalCells) {
    if (dist(mouseX, mouseY, cell.x, cell.y) < 13) {
      window.updateInspector(CELL_INFO.luminal.badge, CELL_INFO.luminal.title, CELL_INFO.luminal.desc);
      return;
    }
  }

  // Check Myoepithelial cells
  for (let cell of myoCells) {
    if (!cell.breached && dist(mouseX, mouseY, cell.x, cell.y) < 14) {
      window.updateInspector(CELL_INFO.myoepithelial.badge, CELL_INFO.myoepithelial.title, CELL_INFO.myoepithelial.desc);
      return;
    }
  }

  // Check Basement Membrane ring
  const dFromCenter = dist(mouseX, mouseY, cx, cy);
  if (abs(dFromCenter - 168) < 12) {
    window.updateInspector(CELL_INFO.membrane.badge, CELL_INFO.membrane.title, CELL_INFO.membrane.desc);
  }
}

// Exposed hooks for app.js buttons
window.setSimulationStage = function (stage) {
  simStage = stage;
  buildDuctCells();
};

window.setShowInterferon = function (val) {
  showInterferon = val;
};