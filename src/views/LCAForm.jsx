import React, { useState } from "react";
import FormStepper from "../components/FormStepper";

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
    const p = { ...project, updated: new Date().toISOString().split("T")[0] };
    if (onSave) onSave(p);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">{project.id ? `Edit: ${project.name}` : "Create New Project"}</h1>
      <p className="text-sm text-gray-500 mb-6">Start a new comprehensive life cycle assessment.</p>

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
            <h3 className="text-lg font-semibold mb-4">Project Review</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div><strong>Name:</strong> {project.name || "—"}</div>
              <div><strong>Functional unit:</strong> {project.functionalUnit || "—"}</div>
              <div><strong>Goal:</strong> {project.assessmentGoal || "—"}</div>
              <div><strong>Metals:</strong> {project.metals.map((m) => m.type || "Unnamed").join(", ") || "—"}</div>
              <div><strong>Target recycled:</strong> {project.targetRecycled || "—"}</div>
            </div>
          </div>
        )}
      </FormStepper>
    </div>
  );
}
