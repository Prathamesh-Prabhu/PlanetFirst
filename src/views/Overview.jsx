import React, { useEffect } from "react";
import StatCard from "../components/StatCard";
import ProjectCard from "../components/ProjectCard";

export default function Overview({ projects, onOpen }) {
  useEffect(() => {
    // nothing for now, but replicates the idea of re-rendering on mount
  }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard number={projects.length} label="Total Projects" />
        <StatCard number={projects.filter((p) => p.status === "completed").length} label="Completed" />
        <StatCard number="1,247" label="Total Emissions (tCO₂eq)" />
        <StatCard number="73%" label="Avg Circularity" />
      </div>

      <div className="bg-white border rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Recent Projects</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length ? (
              projects.slice().reverse().map((p) => <ProjectCard key={p.id} project={p} onOpen={onOpen} />)
            ) : (
              <div className="text-gray-500">No projects yet. Click "New Project" to get started.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
