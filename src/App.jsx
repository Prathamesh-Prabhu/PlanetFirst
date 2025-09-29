import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Overview from "./views/Overview";
import LCAForm from "./views/LCAForm";
import Templates from "./views/Templates";
import Analytics from "./views/Analytics";
import ProjectDetail from "./views/ProjectDetail";
import sampleProjects from "./data/projects";
import About from "./views/About"; // <-- new

export default function App() {
  const [view, setView] = useState("overview");
  const [projects, setProjects] = useState(sampleProjects);
  const [selectedProject, setSelectedProject] = useState(null);

  function openProject(project) {
    setSelectedProject(project);
    setView("project-detail");
  }

  function addOrUpdateProject(newProject) {
    setProjects((prev) => {
      const exists = prev.find((p) => p.id === newProject.id);
      if (exists) {
        return prev.map((p) => (p.id === newProject.id ? { ...newProject, updated: new Date().toISOString().split("T")[0] } : p));
      } else {
        return [...prev, { ...newProject, id: Date.now(), created: new Date().toISOString().split("T")[0], updated: new Date().toISOString().split("T")[0] }];
      }
    });
  }

  function duplicateProject(id) {
    const project = projects.find((p) => p.id === id);
    if (!project) return;
    const copy = {
      ...project,
      id: Date.now(),
      name: `${project.name} (Copy)`,
      status: "draft",
      created: new Date().toISOString().split("T")[0],
      updated: new Date().toISOString().split("T")[0],
    };
    setProjects((prev) => [...prev, copy]);
    setSelectedProject(copy);
    setView("project-detail");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        setView={setView}
        projects={projects}
        openProject={(id) => {
          const p = projects.find((x) => x.id === id);
          if (p) openProject(p);
        }}
      />
      <div className="flex-1 flex flex-col">
        <Topbar view={view} onNew={() => setView("lca-form")} />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {view === "overview" && <Overview projects={projects} onOpen={openProject} />}
          {view === "lca-form" && <LCAForm onSave={(p) => { addOrUpdateProject(p); setView("overview"); }} />}
          {view === "templates" && <Templates onCreate={(template) => { addOrUpdateProject(template); setView("lca-form"); }} />}
          {view === "analytics" && <Analytics projects={projects} />}
          {view === "about" && <About />} {/* <-- new */}
          {view === "project-detail" && selectedProject && (
            <ProjectDetail
              project={selectedProject}
              onEdit={() => setView("lca-form")}
              onDuplicate={() => duplicateProject(selectedProject.id)}
              onBack={() => setView("overview")}
            />
          )}
        </main>
      </div>
    </div>
  );
}
