import React from "react";

export default function ProjectDetail({ project, onEdit, onDuplicate, onBack }) {
  return (
    <div className="max-w-4xl mx-auto bg-white border rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">{project.name}</h2>
          <p className="text-sm text-gray-500 mt-1">{project.description}</p>
        </div>
        <div className="space-x-2">
          <button onClick={onEdit} className="px-3 py-2 bg-indigo-600 text-white rounded">Edit Assessment</button>
          <button onClick={onDuplicate} className="px-3 py-2 bg-gray-100 rounded">Duplicate</button>
          <button onClick={onBack} className="px-3 py-2 bg-white border rounded">Back</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-gray-50 p-4 rounded border">
          <div className="text-xs text-gray-500">Functional Unit</div>
          <div className="font-medium mt-1">{project.functionalUnit || "Not set"}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded border">
          <div className="text-xs text-gray-500">Assessment Goal</div>
          <div className="font-medium mt-1">{project.assessmentGoal || "Not set"}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded border">
          <div className="text-xs text-gray-500">Status</div>
          <div className="font-medium mt-1">{project.status}</div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold mb-2">Metals</h4>
        <div className="space-y-2">
          {project.metals.length ? project.metals.map((m, i) => (
            <div key={i} className="p-3 border rounded bg-white">
              <div className="font-medium">{m}</div>
            </div>
          )) : <div className="text-gray-500">No metals added</div>}
        </div>
      </div>
    </div>
  );
}
