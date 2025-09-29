import React from "react";

export default function Topbar({ view, onNew }) {
  const labels = {
    overview: "Overview",
    "lca-form": "Create New Project",
    templates: "Templates",
    analytics: "Analytics",
    "project-detail": "Project Detail",
  };
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500">Dashboard</div>
        <div className="text-sm text-gray-600">/</div>
        <div className="font-semibold">{labels[view] || "Dashboard"}</div>
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-2 rounded border bg-green-600 text-white hover:bg-green-700 transition-fast" onClick={onNew}>New Project</button>
      </div>
    </header>
  );
}
