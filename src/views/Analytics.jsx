// src/views/Analytics.jsx
import React, { useMemo, useState } from "react";
import Heatmap from "../components/HeatMap.jsx";

import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
  PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area,
  ComposedChart, ReferenceLine
} from "recharts";

/**
 * Analytics view: supports All Projects (combined) and per-project views.
 * Deterministic generation of numeric series from project data (no "demo" labels).
 *
 * Props:
 *  - projects: array of project objects (id, name, metals[], created, updated, status, functionalUnit, assessmentGoal, description)
 */

export default function Analytics({ projects = [] }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProjectId, setSelectedProjectId] = useState("all");

  // Helper deterministic generator (no randomness): returns a base number from project fields
  const projectBase = (project) => {
    // create a stable base influenced by id, name length, metals count, and status
    const idPart = Number(project.id || 0) % 97;
    const namePart = (project.name || "").length * 3;
    const metalsPart = (project.metals ? project.metals.length : 0) * 40;
    const statusPart = project.status === "completed" ? -20 : project.status === "in-progress" ? 10 : 30;
    return 700 + idPart + namePart + metalsPart + statusPart; // e.g., a realistic-ish baseline emissions/scale
  };

  // produce series for a single project (years 2020..2025)
  const seriesForProject = (project) => {
    const base = projectBase(project);
    const years = [2020, 2021, 2022, 2023, 2024, 2025];
    return years.map((y, i) => {
      // deterministic decline/improvement over years plus slight id-based wiggle
      const decline = base * (0.06 * i); // 6% improvement per year by default
      const idWiggle = (Number(project.id) % (i + 3)) * 2;
      const emissions = Math.round(base - decline + idWiggle);
      const energy = Math.round((base * 2) - decline * 1.2 + idWiggle * 1.4);
      const circularity = Math.min(95, Math.max(10, Math.round(50 + (project.metals ? project.metals.length * 6 : 0) + ((Number(project.id) % 10) - 5))));
      return { year: y, emissions, energy, circularity };
    });
  };

  // aggregated combined series across all projects
  const combinedSeries = useMemo(() => {
    const years = [2020, 2021, 2022, 2023, 2024, 2025];
    const totals = years.map(y => ({ year: y, emissions: 0, energy: 0, circularity: 0 }));
    projects.forEach(p => {
      const s = seriesForProject(p);
      s.forEach((row, idx) => {
        totals[idx].emissions += row.emissions;
        totals[idx].energy += row.energy;
        totals[idx].circularity += row.circularity;
      });
    });
    // if there are projects, average circularity
    if (projects.length > 0) {
      totals.forEach(t => (t.circularity = Math.round(t.circularity / projects.length)));
    }
    return totals;
  }, [projects]);

  // per-project map of series (memoized)
  const projectSeriesMap = useMemo(() => {
    const map = {};
    projects.forEach(p => (map[p.id] = seriesForProject(p)));
    return map;
  }, [projects]);

  // Pie (scope split) generator - deterministic from id
  const scopeSplitForProject = (project) => {
    // use id to create split but keep them reasonable
    const id = Number(project.id || 1);
    const s1 = 30 + (id % 10); // 30..39
    const s2 = 25 + (id % 7);  // 25..31
    const s3 = 100 - s1 - s2;
    return [
      { name: "Scope 1", value: s1 },
      { name: "Scope 2", value: s2 },
      { name: "Scope 3", value: s3 },
    ];
  };

  // Tornado data generator (sensitivity ranges) - deterministic
  const tornadoForProject = (project) => {
    const base = Math.max(10, Math.round(projectBase(project) / 50));
    // some variables with low/high percent effects
    const items = [
      { variable: "Electricity carbon intensity", low: -Math.round(base * 0.9), high: Math.round(base * 1.4) },
      { variable: "Energy price",               low: -Math.round(base * 0.6), high: Math.round(base * 1.0) },
      { variable: "Recycling rate",             low: -Math.round(base * 0.45), high: Math.round(base * 0.9) },
      { variable: "Transport distance",         low: -Math.round(base * 0.5), high: Math.round(base * 0.4) },
      { variable: "Material yield",             low: -Math.round(base * 0.3), high: Math.round(base * 0.6) },
    ];
    // sort descending by total magnitude
    return items.sort((a, b) => (Math.abs(b.low) + Math.abs(b.high)) - (Math.abs(a.low) + Math.abs(a.high)));
  };

  // Utility: get currently selected series (combined or per project)
  const selectedSeries = selectedProjectId === "all" ? combinedSeries : projectSeriesMap[selectedProjectId] || [];

  // Utility: scope pie for selected view
  const selectedScope = (() => {
    if (selectedProjectId === "all") {
      // aggregated scope: sum of project splits then normalize
      let totals = { s1: 0, s2: 0, s3: 0 };
      projects.forEach(p => {
        const s = scopeSplitForProject(p);
        totals.s1 += s[0].value; totals.s2 += s[1].value; totals.s3 += s[2].value;
      });
      const sum = totals.s1 + totals.s2 + totals.s3 || 1;
      return [
        { name: "Scope 1", value: Math.round((totals.s1 / sum) * 100) },
        { name: "Scope 2", value: Math.round((totals.s2 / sum) * 100) },
        { name: "Scope 3", value: Math.max(0, 100 - Math.round((totals.s1 / sum) * 100) - Math.round((totals.s2 / sum) * 100)) },
      ];
    } else {
      const project = projects.find(p => String(p.id) === String(selectedProjectId));
      return project ? scopeSplitForProject(project) : [];
    }
  })();

  // colors
  const PIE_COLORS = ["#2563eb", "#f97316", "#16a34a"];

  // derive a few headline metrics for the selected view
  const headline = useMemo(() => {
    if (selectedProjectId === "all") {
      const totalProjects = projects.length;
      // total emissions latest year
      const latest = combinedSeries[combinedSeries.length - 1] || { emissions: 0, circularity: 0 };
      return {
        title: "All Projects",
        totalProjects,
        latestEmissions: latest.emissions,
        avgCircularity: combinedSeries.length ? Math.round(combinedSeries.reduce((s,t)=>s+t.circularity,0)/combinedSeries.length) : 0
      };
    } else {
      const project = projects.find(p => String(p.id) === String(selectedProjectId));
      const series = projectSeriesMap[selectedProjectId] || [];
      const latest = series[series.length - 1] || { emissions: 0, circularity: 0 };
      return {
        title: project ? project.name : "Project",
        totalProjects: 1,
        latestEmissions: latest.emissions,
        avgCircularity: series.length ? Math.round(series.reduce((s,t)=>s+t.circularity,0)/series.length) : 0
      };
    }
  }, [selectedProjectId, projects, combinedSeries, projectSeriesMap]);

  // tab list (local tabs)
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "environmental", label: "Environmental" },
    { key: "circularity", label: "Circularity" },
    { key: "economic", label: "Economic" },
    { key: "comparative", label: "Comparative" },
    { key: "insights", label: "AI Insights" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-semibold">Analytics & Insights</h2>

        {/* Project selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">View:</label>
          <select
            className="border rounded px-3 py-1"
            value={String(selectedProjectId)}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {/* Headline tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow border">
          <div className="text-xs text-gray-500">Scope</div>
          <div className="text-lg font-semibold">{headline.title}</div>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <div className="text-xs text-gray-500">Latest Emissions</div>
          <div className="text-2xl font-bold">{headline.latestEmissions.toLocaleString()}</div>
          <div className="text-xs text-gray-500">kg CO₂-eq (latest year)</div>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <div className="text-xs text-gray-500">Average Circularity</div>
          <div className="text-2xl font-bold text-green-600">{headline.avgCircularity}%</div>
          <div className="text-xs text-gray-500">Material circularity index</div>
        </div>
        <div className="bg-white p-4 rounded shadow border">
          <div className="text-xs text-gray-500">Projects in view</div>
          <div className="text-2xl font-bold">{selectedProjectId === "all" ? projects.length : 1}</div>
          <div className="text-xs text-gray-500">Selectable per project</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3 py-1 rounded ${activeTab === t.key ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Overview tab content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow border">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-semibold">Emissions Trend</div>
                  <div className="text-xs text-gray-500">Yearly emissions (kg CO₂-eq)</div>
                </div>
                <div className="text-sm text-gray-600">{selectedProjectId === "all" ? "Combined projects" : "Project view"}</div>
              </div>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="emissions" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="energy" stroke="#f97316" strokeWidth={1.6} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow border">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-semibold">Energy Source Split</div>
                  <div className="text-xs text-gray-500">Scopes 1/2/3</div>
                </div>
                <div className="text-sm text-gray-600">Proportions</div>
              </div>

              <div className="flex gap-4 items-center">
                <div style={{ width: 180, height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={selectedScope} dataKey="value" nameKey="name" innerRadius={40} outerRadius={72} label>
                        {selectedScope.map((entry, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex-1">
                  {selectedScope.map((s, i) => (
                    <div className="flex justify-between items-center mb-2" key={s.name}>
                      <div className="flex items-center gap-2">
                        <span style={{ width: 12, height: 12, background: PIE_COLORS[i], display: "inline-block", borderRadius: 3 }} />
                        <div className="text-sm">{s.name}</div>
                      </div>
                      <div className="font-semibold">{s.value}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Environmental tab */}
        {activeTab === "environmental" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow border">
              <div className="font-semibold mb-2">Energy & Emissions - Combined view</div>
              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={selectedSeries}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="energy" fill="#fde68a" stroke="#f97316" />
                    <Line type="monotone" dataKey="emissions" stroke="#2563eb" strokeWidth={2} />
                    <ReferenceLine y={1000} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Target", position: "top" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow border">
              <div className="font-semibold mb-2">Process Hotspots (heatmap)</div>
              {/* pass a fixed height so heatmap can compute row heights to fit */}
              <Heatmap
  projects={projects}
  selectedProjectId={selectedProjectId}
  height={300}        // controls total heatmap card height
  nameColWidth={140}  // width for left process column
  minCellWidth={48}   // minimum width for each year cell
  maxValueFont={14}   // maximum font size for numbers
/>
            </div>
          </div>
        )}

        {/* Circularity tab */}
        {activeTab === "circularity" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow border">
              <div className="font-semibold mb-2">Circularity Radar</div>
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={[
                    { metric: "Recycled content", A: selectedSeries.length ? Math.round(selectedSeries.reduce((s,r)=>s+r.circularity,0)/selectedSeries.length) : 73 },
                    { metric: "Material retention", A: Math.max(40, Math.min(90, projectBase(projects[0] || {id:1}) % 100)) },
                    { metric: "Recycling efficiency", A: Math.max(40, Math.min(90, (projects[0]?.metals?.length || 1) * 20)) },
                    { metric: "Design for disassembly", A: 60 },
                    { metric: "Repairability", A: 55 },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Score" dataKey="A" stroke="#16a34a" fill="#16a34a" fillOpacity={0.2} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow border">
                <div className="font-semibold">Recycling Efficiency</div>
                <div className="text-3xl font-bold text-green-600">78%</div>
                <div className="text-xs text-gray-500">Mass recovered ÷ mass collected</div>
              </div>
              <div className="bg-white p-4 rounded shadow border">
                <div className="font-semibold">Material Retention Trend</div>
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedSeries.map(s => ({ x: s.year, y: s.circularity }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="x" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="y" stroke="#16a34a" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Economic tab */}
        {activeTab === "economic" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow border">
              <div className="font-semibold mb-2">Life Cycle Cost by Metal</div>
              <div style={{ height: 300 }}>
                {/* make a simple bar chart using project metals for selected project or sample bars for combined */}
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={(selectedProjectId === "all" ? [
                    { metal: "Copper", cost: 1200 },
                    { metal: "Aluminum", cost: 900 },
                    { metal: "Steel", cost: 700 },
                  ] : ((projects.find(p=>String(p.id)===String(selectedProjectId))?.metals || ["Metal"]).map((m,i)=>({metal:m, cost: (projectBase(projects.find(p=>String(p.id)===String(selectedProjectId))) / (i+1)).toFixed(0)}))))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metal" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cost" fill="#f97316" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow border">
              <div className="font-semibold mb-2">ROI / Payback Example</div>
              <div style={{ height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { x: 0, roi: -5000 },
                    { x: 1, roi: -2000 },
                    { x: 2, roi: 0 },
                    { x: 3, roi: 2500 },
                    { x: 4, roi: 5000 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="roi" stroke="#2563eb" fill="#bfdbfe" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Comparative tab (includes tornado) */}
        {activeTab === "comparative" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow border">
              <div className="font-semibold mb-2">Scenario Comparison</div>
              <div style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { scenario: "Baseline", emissions: 1000, circularity: 50 },
                    { scenario: "Recycling", emissions: 800, circularity: 70 },
                    { scenario: "Eco-design", emissions: 650, circularity: 80 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="scenario" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="emissions" fill="#2563eb" name="Emissions (kg CO₂)" />
                    <Bar dataKey="circularity" fill="#16a34a" name="Circularity (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow border">
              <div className="flex justify-between items-center mb-3">
                <div className="font-semibold">Sensitivity / Tornado Diagram</div>
                <div className="text-xs text-gray-500">{selectedProjectId === "all" ? "Combined sensitivity" : "Project sensitivity"}</div>
              </div>

              <div style={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  {/* create tornado data from selected project or aggregated first project fallback */}
                  <BarChart
                    data={(() => {
                      const p = (selectedProjectId === "all" ? (projects[0] || { id: 1 }) : projects.find(pp => String(pp.id) === String(selectedProjectId)));
                      const tornado = tornadoForProject(p || { id: 1 });
                      return tornado;
                    })()}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="variable" type="category" width={200} />
                    <Tooltip formatter={(v) => `${v}` } />
                    <ReferenceLine x={0} stroke="#9CA3AF" />
                    <Bar dataKey="low" barSize={14} fill="#ef4444" />
                    <Bar dataKey="high" barSize={14} fill="#16a34a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 text-sm text-gray-600">Bars show negative (left) and positive (right) impact ranges for key variables.</div>
            </div>
          </div>
        )}

        {/* Insights tab */}
        {activeTab === "insights" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow border">
              <div className="font-semibold">Top Recommendations</div>
              <div className="mt-3 space-y-3">
                <div className="p-3 rounded border-l-4 border-indigo-600 bg-indigo-50">
                  <div className="font-semibold">Optimize Smelting Process</div>
                  <div>Smelting accounts for a large portion of the footprint. Prioritise lower-carbon heat sources or EAFs where applicable.</div>
                </div>

                <div className="p-3 rounded border-l-4 border-green-600 bg-green-50">
                  <div className="font-semibold">Increase Recycled Content</div>
                  <div>Boost recycled feedstock to reduce primary material demand and lower lifecycle emissions.</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow border">
              <div className="font-semibold">Priority Matrix</div>
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <div className="rounded p-3 border bg-red-50">
                  <div className="font-semibold">High Impact</div>
                  <div>Switch to renewable energy, closed-loop recycling</div>
                </div>
                <div className="rounded p-3 border bg-yellow-50">
                  <div className="font-semibold">Medium Impact</div>
                  <div>Optimize logistics, process efficiency</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
