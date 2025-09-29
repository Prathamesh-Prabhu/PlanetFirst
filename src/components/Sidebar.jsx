import React from "react";
import PlanetFirstLogo from "./PlanetFirstLogo.jpg"; // adjust path if Sidebar is deeper inside folders

export default function Sidebar({ setView, projects, openProject }) {
  return (
    <aside className="w-72 bg-white border-r h-screen sticky top-0">
      {/* Top: PlanetFirst logo + name */}
      <div className="p-6 border-b bg-gradient-to-r from-green-50 to-white flex items-center gap-3">
        {/* Logo image */}
        <img
          src={PlanetFirstLogo}
          alt="PlanetFirst Logo"
          className="w-10 h-10 object-contain rounded-full shadow"
        />

        <div>
          <div className="text-lg font-bold">PlanetFirst</div>
          <div className="text-xs text-gray-500">Metals LCA Studio</div>
        </div>
      </div>

      <nav className="p-4 space-y-6">
        <div>
          <div className="text-xs uppercase text-gray-500 font-semibold mb-2">Dashboard</div>
          <div className="space-y-1">
            <button
              className="w-full text-left p-2 rounded transition-fast hover:bg-gray-100"
              onClick={() => setView("overview")}
            >
              Overview
            </button>
            <button
              className="w-full text-left p-2 rounded transition-fast hover:bg-gray-100"
              onClick={() => setView("lca-form")}
            >
              New Project
            </button>
          </div>
        </div>

        <div id="recent-projects">
          <div className="text-xs uppercase text-gray-500 font-semibold mb-2">
            Recent Projects
          </div>
          <div className="space-y-1 max-h-48 overflow-auto">
            {projects.slice(-10).reverse().map((p) => (
              <button
                key={p.id}
                className="w-full text-left p-2 rounded transition-fast hover:bg-gray-100 text-sm flex items-center gap-2"
                onClick={() => openProject(p.id)}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    p.status === "completed"
                      ? "bg-green-600"
                      : p.status === "in-progress"
                      ? "bg-yellow-600"
                      : "bg-gray-400"
                  }`}
                ></span>
                <span>{p.name}</span>
              </button>
            ))}
            {projects.length === 0 && (
              <div className="text-sm text-gray-500">No projects yet</div>
            )}
          </div>
        </div>

        <div>
          <div className="text-xs uppercase text-gray-500 font-semibold mb-2">Tools</div>
          <div className="space-y-1">
            <button
              className="w-full text-left p-2 rounded transition-fast hover:bg-gray-100"
              onClick={() => setView("templates")}
            >
              Templates
            </button>
            <button
              className="w-full text-left p-2 rounded transition-fast hover:bg-gray-100"
              onClick={() => setView("analytics")}
            >
              Analytics
            </button>
            <button
              className="w-full text-left p-2 rounded transition-fast hover:bg-gray-100"
              onClick={() => setView("about")}
            >
              About
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
}
