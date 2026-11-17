document.addEventListener("DOMContentLoaded", () => {
    // 1. Top Navigation Tab Switching
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");
  
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-tab");
  
        tabButtons.forEach((b) => b.classList.remove("active"));
        tabPanels.forEach((p) => p.classList.remove("active"));
  
        btn.classList.add("active");
        document.getElementById(targetId).classList.add("active");
      });
    });
  
    // 2. Simulation State Controls (Healthy vs. DCIS vs. IDC)
    const stageButtons = document.querySelectorAll(".stage-btn");
    stageButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        stageButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
  
        const newStage = btn.getAttribute("data-stage");
        if (window.setSimulationStage) {
          window.setSimulationStage(newStage);
        }
      });
    });
  
    // 3. Interferon Signaling Toggle
    const ifnCheckbox = document.getElementById("toggle-ifn");
    ifnCheckbox.addEventListener("change", (e) => {
      if (window.setShowInterferon) {
        window.setShowInterferon(e.target.checked);
      }
    });
  });
  
  // Helper called by simulation.js when a user clicks a cell/structure
  window.updateInspector = function (badge, title, description) {
    document.getElementById("inspector-badge").textContent = badge;
    document.getElementById("inspector-title").textContent = title;
    document.getElementById("inspector-desc").innerHTML = description;
  };