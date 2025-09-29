import React, { useState } from "react";
import Tabs from "../components/Tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Analytics({ projects }) {
  const [active, setActive] = useState("overview");

  const tabs = [
    { key: "overview", label: "Overview", content: <OverviewPanel projects={projects} /> },
    { key: "environmental", label: "Environmental Impact", content: <EnvironmentalChart /> },
    { key: "circularity", label: "Circularity Indicators", content: <CircularityChart /> },
    { key: "economic", label: "Economic Indicators", content: <EconomicChart /> },
    { key: "comparative", label: "Comparative Metrics", content: <ComparativeChart /> },
    { key: "insights", label: "AI Insights", content: <div className="text-gray-600">AI insights placeholder</div> },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Analytics & Insights</h2>
      <Tabs tabs={tabs} active={active} onChange={setActive} />
    </div>
  );
}

function OverviewPanel({ projects }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatBox label="Total Projects" value={projects.length} />
        <StatBox label="Completed" value={projects.filter(p => p.status === "completed").length} />
        <StatBox label="Total Emissions" value="1,247 tCO₂eq" />
        <StatBox label="Avg Circularity" value="73%" />
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-white p-4 rounded border text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function EnvironmentalChart() {
  const data = [
    { year: 2020, emissions: 1400 },
    { year: 2021, emissions: 1280 },
    { year: 2022, emissions: 1100 },
    { year: 2023, emissions: 970 },
    { year: 2024, emissions: 856 },
  ];
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="emissions" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function CircularityChart() {
  const data = [
    { name: "Recycled Content", value: 73 },
    { name: "Virgin Material", value: 27 },
  ];
  const colors = ["#16a34a", "#9ca3af"];
  return (
    <div className="h-96 flex justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={120} label>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function EconomicChart() {
  const data = [
    { metal: "Copper", cost: 1200 },
    { metal: "Aluminum", cost: 900 },
    { metal: "Steel", cost: 700 },
  ];
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metal" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cost" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ComparativeChart() {
  const data = [
    { scenario: "Baseline", emissions: 1000, circularity: 50 },
    { scenario: "Recycling", emissions: 800, circularity: 70 },
    { scenario: "Eco-design", emissions: 650, circularity: 80 },
  ];
  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
  );
}
