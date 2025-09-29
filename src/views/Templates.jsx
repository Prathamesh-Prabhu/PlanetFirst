import React from "react";

export default function Templates({ onCreate }) {
  const templates = [
    {
      id: "tpl-copper",
      name: "Copper Wire & Cable",
      description: "Pre-configured template for copper wire & cable LCA",
      template: { name: "Copper Wire & Cable", description: "Template project", metals: ["Copper"], status: "draft" },
    },
    {
      id: "tpl-aluminum",
      name: "Aluminum Extrusions",
      description: "Template for aluminum extrusion products",
      template: { name: "Aluminum Extrusions", description: "Template project", metals: ["Aluminum"], status: "draft" },
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-3">Project Templates</h2>
      <p className="text-sm text-gray-500 mb-4">Pre-configured templates for common metal types.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-gray-600">{t.description}</div>
              </div>
              <div>
                <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={() => onCreate && onCreate(t.template)}>Use Template</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
