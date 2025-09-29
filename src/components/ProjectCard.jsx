import React from "react";

export default function ProjectCard({ project, onOpen }) {
  const badgeClass = project.status === "completed" ? "bg-green-100 text-green-700" : project.status === "in-progress" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600";
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-fast cursor-pointer" onClick={() => onOpen(project)}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-semibold">{project.name}</div>
          <div className="text-xs text-gray-500">Updated {new Date(project.updated).toLocaleDateString()}</div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${badgeClass}`}>{project.status}</span>
      </div>
      <div className="text-sm text-gray-600">{project.description}</div>
    </div>
  );
}
