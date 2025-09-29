import React, { useState } from "react";
import FormStepper from "../components/FormStepper";
import AiAssistant from "../components/AiAssistant";

export default function LCAForm({ onSave }) {
  const [step, setStep] = useState(1);
  const [project, setProject] = useState({
    id: null,
    name: "",
    description: "",
    assessmentGoal: "",
    geographicScope: "global",
    timeHorizon: "cradle-grave",
    functionalUnit: "",
    referenceYear: "2023",
    metals: [],
    primaryObjective: "",
    targetRecycled: "",
    carbonBudget: "",
    improvementTimeframe: "short",
    investmentWillingness: "low",
    dataSource: "secondary",
    comparisonBenchmark: "none",
    sensitivityVars: "",
    status: "draft",
  });

  // AI assistant UI state
  const [aiActive, setAiActive] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiSub, setAiSub] = useState("");

  // ---------- Project helpers ----------
  function addMetal(type = "") {
    setProject((p) => ({ ...p, metals: [...p.metals, { id: Date.now() + Math.random(), type: type || "", lifecycleStages: [], expanded: true }] }));
  }
  function removeMetal(id) {
    setProject((p) => ({ ...p, metals: p.metals.filter((m) => m.id !== id) }));
  }
  function updateMetal(id, updates) {
    setProject((p) => ({ ...p, metals: p.metals.map((m) => (m.id === id ? { ...m, ...updates } : m)) }));
  }

  function validateStep(s) {
    if (s === 1) {
      if (!project.name.trim() || !project.functionalUnit.trim()) {
        alert("Please fill required fields: Project Name and Functional Unit.");
        return false;
      }
    }
    return true;
  }

  function next() {
    if (!validateStep(step)) return;
    if (step < 4) setStep((s) => s + 1);
    else handleSubmit();
  }
  function back() {
    if (step > 1) setStep((s) => s - 1);
  }

  function handleSubmit() {
    const p = { ...project, updated: new Date().toISOString().split("T")[0], created: project.created || new Date().toISOString().split("T")[0] };
    if (onSave) onSave(p);
  }

  // Utility: export/download JSON
  function downloadJSON() {
    const dataStr = JSON.stringify(project, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(project.name || "project").replace(/\s+/g, "_").toLowerCase()}_lca.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Utility: copy JSON to clipboard
  async function copyJSON() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(project, null, 2));
      alert("Project JSON copied to clipboard.");
    } catch (e) {
      alert("Copy failed. Your browser may not support clipboard access.");
    }
  }

  const showOrDash = (v) => (v || "—");

  // ------------- AI simulation helpers -------------
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Determine which fields are missing for the current step
  function checkMissingFields(s, proj) {
    const missing = [];
    if (s === 1) {
      if (!proj.name || !proj.name.trim()) missing.push("Project Name");
      if (!proj.functionalUnit || !proj.functionalUnit.trim()) missing.push("Functional Unit");
    }
    if (s === 2) {
      if (!proj.metals || proj.metals.length === 0) missing.push("Metals (add at least one)");
      else {
        proj.metals.forEach((m, i) => {
          if (!m.type || !m.type.trim()) missing.push(`Metal ${i + 1} name`);
          if (!m.lifecycleStages || m.lifecycleStages.length === 0) missing.push(`Metal ${i + 1} lifecycle stages`);
        });
      }
    }
    if (s === 3) {
      if (!proj.primaryObjective) missing.push("Primary Objective");
      if (!proj.targetRecycled) missing.push("Target Recycled Content");
    }
    // step 4 is review — nothing strictly required, but we can check status
    if (s === 4) {
      if (!proj.status || proj.status === "draft") missing.push("Project status (consider setting to in-progress/completed)");
    }
    return missing;
  }

  // Generate plausible values to fill missing fields for the step
  function aiGenerateForStep(s) {
    const updates = {};
    const metalsToAdd = [];

    if (s === 1) {
      if (!project.name || !project.name.trim()) updates.name = pick(["Green Copper Cable", "PlanetFirst Alloy Plan", "Sustainable Wire Project"]);
      if (!project.functionalUnit || !project.functionalUnit.trim()) updates.functionalUnit = pick(["1 km of cable", "1 tonne of copper", "1 m2 conductive sheet"]);
      if (!project.assessmentGoal) updates.assessmentGoal = pick(["eco-design", "circularity", "compliance"]);
      if (!project.description) updates.description = "Auto-generated description for prototype project.";
    } else if (s === 2) {
      if (!project.metals || project.metals.length === 0) {
        const metalNames = ["Copper", "Aluminium", "Nickel", "Steel", "Zinc"];
        const count = randomInt(1, 2);
        for (let i = 0; i < count; i++) {
          const name = pick(metalNames);
          metalsToAdd.push({
            id: Date.now() + Math.random() + i,
            type: name,
            lifecycleStages: ["Mining", "Smelting", "Fabrication", "Use", "Recycling"],
            expanded: false,
            preferredTreatment: pick(["Standard", "High-recycle", "Energy-efficient"]),
          });
        }
      } else {
        // For existing metals, fill missing subfields
        const perMetal = project.metals.map((m) => {
          const upd = { id: m.id };
          if (!m.type || !m.type.trim()) upd.type = pick(["Copper", "Aluminium"]);
          if (!m.lifecycleStages || m.lifecycleStages.length === 0) upd.lifecycleStages = ["Mining", "Smelting", "Fabrication", "Recycling"];
          if (!m.preferredTreatment) upd.preferredTreatment = pick(["Standard", "High-recycle"]);
          return upd;
        });
        updates.metals = perMetal;
      }
    } else if (s === 3) {
      if (!project.primaryObjective) updates.primaryObjective = pick(["min-carbon", "max-circularity", "balanced"]);
      if (!project.targetRecycled) updates.targetRecycled = String(randomInt(10, 70));
      if (!project.dataSource) updates.dataSource = pick(["secondary", "primary", "estimated"]);
      if (!project.comparisonBenchmark) updates.comparisonBenchmark = pick(["industry-avg", "best-practice", "none"]);
      if (!project.sensitivityVars) updates.sensitivityVars = "Energy price, Recycling rate, Transport distance";
    } else if (s === 4) {
      if (!project.status || project.status === "draft") updates.status = pick(["in-progress", "completed"]);
      if (!project.carbonBudget) updates.carbonBudget = String(randomInt(1000, 50000));
      if (!project.investmentWillingness) updates.investmentWillingness = pick(["low", "medium", "high"]);
    }

    return { updates, metalsToAdd };
  }

  // Apply AI generated updates to project
  function applyAiResult({ updates, metalsToAdd }) {
    setProject((p) => {
      let next = { ...p };
      for (const k in updates) {
        if (k === "metals") continue;
        next[k] = updates[k];
      }
      if (updates.metals && Array.isArray(updates.metals)) {
        next.metals = next.metals.map((m) => {
          const found = updates.metals.find((um) => um.id === m.id);
          return found ? { ...m, ...found } : m;
        });
      }
      if (metalsToAdd && metalsToAdd.length) {
        next.metals = [...(next.metals || []), ...metalsToAdd];
      }
      return next;
    });
  }

  // AI run: only when missing fields exist (manual trigger)
  async function aiFillStep(s = step) {
    const missing = checkMissingFields(s, project);
    if (missing.length === 0) {
      // show friendly popup that nothing needs filling
      setAiActive(true);
      setAiMessage("All required fields for this step look filled — nothing to auto-fill.");
      setAiSub("You can still click 'AI fill this step' to add suggested extras.");
      setTimeout(() => {
        setAiActive(false);
        setAiMessage("");
        setAiSub("");
      }, 2000);
      return;
    }

    // show assistant active
    setAiActive(true);
    setAiMessage(`Filling ${missing.length} missing field(s): ${missing.slice(0, 3).join(", ")}${missing.length > 3 ? "..." : ""}`);
    setAiSub("Simulating a model suggestion — editable after apply.");

    // small simulated progress sequence
    await new Promise((r) => setTimeout(r, 600));
    setAiMessage("Generating plausible defaults...");
    await new Promise((r) => setTimeout(r, 700));
    setAiMessage("Applying the suggested values...");
    await new Promise((r) => setTimeout(r, 500));

    const result = aiGenerateForStep(s);
    applyAiResult(result);

    setAiMessage("Done — missing fields have been filled. Please review and edit if needed.");
    setAiSub("Changes are suggestions; you can modify any field.");
    setTimeout(() => {
      setAiActive(false);
      setAiMessage("");
      setAiSub("");
    }, 2200);
  }

  function closeAi() {
    setAiActive(false);
    setAiMessage("");
    setAiSub("");
  }

  const estimateEmissions = () => Math.max(0, Math.round((project.metals.length + (project.name?.length || 0)) * 120)).toLocaleString();

  return (
    <div className="max-w-5xl mx-auto relative">
      <h1 className="text-2xl font-semibold mb-2">{project.id ? `Edit: ${project.name}` : "Create New Project"}</h1>
      <p className="text-sm text-gray-500 mb-6">Start a new comprehensive life cycle assessment.</p>

      {/* AI fill button (manual only) */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <button
          className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
          onClick={() => aiFillStep(step)}
        >
          ✨ AI fill this step
        </button>
      </div>

      <FormStepper step={step} setStep={setStep} onNext={next} onPrev={back} isLast={step === 4}>
        {step === 1 && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Project Name <span className="text-red-500">*</span></label>
                <input value={project.name} onChange={(e) => setProject({ ...project, name: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g., Green Copper Cable Initiative" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Assessment Goal</label>
                <select value={project.assessmentGoal} onChange={(e) => setProject({ ...project, assessmentGoal: e.target.value })} className="w-full p-2 border rounded">
                  <option value="">Select a goal</option>
                  <option value="compliance">Compliance Reporting</option>
                  <option value="eco-design">Eco-design</option>
                  <option value="circularity">Circularity Optimization</option>
                  <option value="comparative">Comparative Analysis</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block font-semibold mb-1">Geographic Scope</label>
                <select value={project.geographicScope} onChange={(e) => setProject({ ...project, geographicScope: e.target.value })} className="w-full p-2 border rounded">
                  <option value="na">North America</option>
                  <option value="eu">European Union</option>
                  <option value="asia">Asia-Pacific</option>
                  <option value="global">Global</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Time Horizon</label>
                <select value={project.timeHorizon} onChange={(e) => setProject({ ...project, timeHorizon: e.target.value })} className="w-full p-2 border rounded">
                  <option value="cradle-gate">Cradle-to-gate</option>
                  <option value="cradle-grave">Cradle-to-grave</option>
                  <option value="cradle-cradle">Cradle-to-cradle</option>
                  <option value="gate-gate">Gate-to-gate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block font-semibold mb-1">Functional Unit <span className="text-red-500">*</span></label>
                <input value={project.functionalUnit} onChange={(e) => setProject({ ...project, functionalUnit: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g., 1 km of power cable" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Reference Year</label>
                <select value={project.referenceYear} onChange={(e) => setProject({ ...project, referenceYear: e.target.value })} className="w-full p-2 border rounded">
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-semibold mb-1">Project Description</label>
              <textarea value={project.description} onChange={(e) => setProject({ ...project, description: e.target.value })} className="w-full p-2 border rounded" placeholder="Describe your project..."></textarea>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Metals & Lifecycle Stages</h3>
            <p className="text-sm text-gray-500 mb-4">Add and configure each metal and its lifecycle.</p>

            <div>
              {project.metals.map((m) => (
                <div key={m.id} className="border rounded mb-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50">
                    <div className="font-semibold">{m.type || "Unnamed metal"}</div>
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 text-sm border rounded" onClick={() => updateMetal(m.id, { expanded: !m.expanded })}>
                        {m.expanded ? "Collapse" : "Expand"}
                      </button>
                      <button className="px-2 py-1 text-sm border rounded text-red-600" onClick={() => removeMetal(m.id)}>Remove</button>
                    </div>
                  </div>
                  {m.expanded && (
                    <div className="p-3">
                      <label className="block mb-1">Metal Type</label>
                      <input value={m.type} onChange={(e) => updateMetal(m.id, { type: e.target.value })} className="w-full p-2 border rounded mb-3" placeholder="e.g., Copper" />

                      <label className="block mb-1">Lifecycle stages (comma separated)</label>
                      <input value={m.lifecycleStages?.join?.(", ") || ""} onChange={(e) => updateMetal(m.id, { lifecycleStages: e.target.value.split(",").map(s => s.trim()) })} className="w-full p-2 border rounded" placeholder="Mining, Smelting, Fabrication, Recycling" />
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-3">
                <button className="w-full border-2 border-dashed p-3 rounded text-gray-600 hover:border-indigo-500" onClick={() => addMetal()}>
                  + Add Metal
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white border rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-semibold">Circularity Goals & Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Primary Objective</label>
                <select value={project.primaryObjective} onChange={(e) => setProject({ ...project, primaryObjective: e.target.value })} className="w-full p-2 border rounded">
                  <option value="">Select primary objective</option>
                  <option value="min-carbon">Minimize carbon footprint</option>
                  <option value="max-circularity">Maximize circularity</option>
                  <option value="cost-opt">Cost optimization</option>
                  <option value="balanced">Balanced approach</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Target Recycled Content (%)</label>
                <input value={project.targetRecycled} onChange={(e) => setProject({ ...project, targetRecycled: e.target.value })} type="number" className="w-full p-2 border rounded" placeholder="e.g., 50" />
              </div>
            </div>

            <h4 className="font-semibold mt-4">Data Quality & Scenario Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1">Primary Data Source Type</label>
                <select value={project.dataSource} onChange={(e) => setProject({ ...project, dataSource: e.target.value })} className="w-full p-2 border rounded">
                  <option value="primary">Primary (measured)</option>
                  <option value="secondary">Secondary (industry avg.)</option>
                  <option value="estimated">Estimated</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Comparison Benchmark</label>
                <select value={project.comparisonBenchmark} onChange={(e) => setProject({ ...project, comparisonBenchmark: e.target.value })} className="w-full p-2 border rounded">
                  <option value="none">None</option>
                  <option value="industry-avg">Industry Average</option>
                  <option value="best-practice">Best Practice</option>
                  <option value="regulatory">Regulatory Limits</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1">Key Variables to Test for Sensitivity</label>
              <textarea value={project.sensitivityVars} onChange={(e) => setProject({ ...project, sensitivityVars: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g., Energy price, Recycling rate, Transport distance..."></textarea>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white border rounded-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Project Review — {project.name || "Untitled project"}</h3>
                <p className="text-sm text-gray-500 mb-4">Review all details below before saving. You can save, export JSON, or copy the project to clipboard.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded bg-gray-50">
                    <div className="text-xs text-gray-500">Meta</div>
                    <div className="font-semibold mt-1">{showOrDash(project.name)}</div>
                    <div className="text-sm text-gray-600 mt-2">{showOrDash(project.description)}</div>

                    <div className="mt-3 space-y-1 text-sm">
                      <div><span className="text-gray-500">Assessment Goal: </span><strong>{showOrDash(project.assessmentGoal)}</strong></div>
                      <div><span className="text-gray-500">Functional Unit: </span><strong>{showOrDash(project.functionalUnit)}</strong></div>
                      <div><span className="text-gray-500">Reference Year: </span><strong>{showOrDash(project.referenceYear)}</strong></div>
                      <div><span className="text-gray-500">Time Horizon: </span><strong>{showOrDash(project.timeHorizon)}</strong></div>
                    </div>
                  </div>

                  <div className="p-4 border rounded bg-gray-50">
                    <div className="text-xs text-gray-500">Project Settings</div>
                    <div className="mt-2 text-sm space-y-1">
                      <div><span className="text-gray-500">Geographic Scope: </span><strong>{showOrDash(project.geographicScope)}</strong></div>
                      <div><span className="text-gray-500">Primary Objective: </span><strong>{showOrDash(project.primaryObjective)}</strong></div>
                      <div><span className="text-gray-500">Target Recycled: </span><strong>{project.targetRecycled ? `${project.targetRecycled}%` : "—"}</strong></div>
                      <div><span className="text-gray-500">Data Source: </span><strong>{showOrDash(project.dataSource)}</strong></div>
                      <div><span className="text-gray-500">Benchmark: </span><strong>{showOrDash(project.comparisonBenchmark)}</strong></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-gray-500">Status & Dates</div>
                  <div className="flex gap-3 items-center mt-2">
                    <div className={`px-2 py-1 rounded text-sm ${project.status === "completed" ? "bg-green-100 text-green-700" : project.status === "in-progress" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>{project.status}</div>
                    <div className="text-sm text-gray-500">Created: {project.created || "—"}</div>
                    <div className="text-sm text-gray-500">Updated: {project.updated || "—"}</div>
                  </div>
                </div>
              </div>

              {/* Right column: metals and sensitivity */}
              <div className="w-full md:w-1/2">
                <div className="mb-4">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">Metals</div>
                    <div className="text-sm text-gray-600">{project.metals.length} added</div>
                  </div>

                  <div className="mt-3 space-y-2 max-h-64 overflow-auto pr-2">
                    {project.metals.length ? project.metals.map((m) => (
                      <div key={m.id} className="p-3 border rounded bg-white shadow-sm">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="font-semibold">{m.type || "Unnamed metal"}</div>
                            <div className="text-xs text-gray-500 mt-1">{(m.lifecycleStages || []).join(" → ") || "No lifecycle stages specified"}</div>
                          </div>
                          <div className="text-xs text-gray-500">{m.id ? String(m.id).slice(-4) : ""}</div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <div><strong>Quick metrics:</strong></div>
                          <div className="text-xs text-gray-500">Estimated share: <span className="font-medium">{Math.max(5, (m.type?.length || 1) * 3)}%</span></div>
                          <div className="text-xs text-gray-500">Preferred treatment: <span className="font-medium">{m.preferredTreatment || "Standard"}</span></div>
                        </div>
                      </div>
                    )) : <div className="text-sm text-gray-500">No metals added yet.</div>}
                  </div>
                </div>

                <div className="p-3 border rounded bg-gray-50">
                  <div className="text-xs text-gray-500">Sensitivity variables</div>
                  <div className="mt-2 text-sm text-gray-700">{project.sensitivityVars || "Not specified"}</div>
                </div>
              </div>
            </div>

            {/* Summary metrics */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded text-center bg-white">
                <div className="text-xs text-gray-500">Estimated Emissions (proxy)</div>
                <div className="text-2xl font-bold mt-2">{estimateEmissions()} </div>
                <div className="text-xs text-gray-500">kg CO₂-eq (proxy)</div>
              </div>
              <div className="p-4 border rounded text-center bg-white">
                <div className="text-xs text-gray-500">Material Circularity Index (proxy)</div>
                <div className="text-2xl font-bold text-green-600 mt-2">{Math.min(95, 30 + (project.metals.length * 8) + Math.min(30, (project.targetRecycled || 0)))}%</div>
                <div className="text-xs text-gray-500">Higher is better</div>
              </div>
              <div className="p-4 border rounded text-center bg-white">
                <div className="text-xs text-gray-500">Estimated Cost Impact</div>
                <div className="text-2xl font-bold text-orange-600 mt-2">₹{Math.round(Math.max(1000, (project.metals.length || 1) * 1250)).toLocaleString()}</div>
                <div className="text-xs text-gray-500">Capex + Opex proxy</div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3 items-center">
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSubmit}>Save Project</button>
              <button className="px-4 py-2 border rounded" onClick={downloadJSON}>Export JSON</button>
              <button className="px-4 py-2 border rounded" onClick={copyJSON}>Copy JSON</button>
              <button className="px-4 py-2 border rounded text-gray-700" onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit Details</button>
              <div className="text-sm text-gray-500 ml-auto">Tip: Use Export to share project data for review.</div>
            </div>
          </div>
        )}
      </FormStepper>

      {/* AI assistant (floating) */}
      <AiAssistant active={aiActive} message={aiMessage} subMessage={aiSub} onClose={closeAi} />
    </div>
  );
}
