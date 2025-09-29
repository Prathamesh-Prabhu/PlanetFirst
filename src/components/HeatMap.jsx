import React, { useMemo } from "react";

const DEFAULT_YEARS = [2020, 2021, 2022, 2023, 2024, 2025];
const PROCESSES = ["Smelting", "Transport", "Mining", "Fabrication", "Recycling", "Waste treatment"];

function projectSeedValue(project, processIndex, yearIndex) {
  const id = Number(project?.id || 1);
  const nameLen = (project?.name || "").length;
  const metalsCount = (project?.metals?.length || 0);
  const base = (id % 97) + nameLen * 2 + metalsCount * 6;
  const procFactor = (processIndex + 3) * 7;
  const yearFactor = (yearIndex + 1) * 3;
  return Math.abs(((base * procFactor) % 100) - yearFactor) + 10;
}

function normalizeGrid(grid) {
  let min = Infinity, max = -Infinity;
  grid.forEach(r =>
    r.values.forEach(v => {
      if (v < min) min = v;
      if (v > max) max = v;
    })
  );
  if (!isFinite(min) || !isFinite(max)) {
    min = 0;
    max = 1;
  }
  const range = Math.max(1e-6, max - min);
  return grid.map(r => ({
    ...r,
    norm: r.values.map(v => (v - min) / range)
  }));
}

function colorForNorm(n) {
  const lightness = 85 - Math.round(n * 55); // 85 → 30
  const sat = 65 + Math.round(n * 20);
  return `hsl(0 ${sat}% ${lightness}%)`;
}

export default function Heatmap({ selectedProjects = [], years = DEFAULT_YEARS }) {
  const grid = useMemo(() => {
    if (!selectedProjects || selectedProjects.length === 0) {
      const sample = [
        [4200, 4300, 4100, 4400, 4700, 4600],
        [3500, 3600, 4000, 4800, 5200, 5600],
        [3000, 3100, 3300, 4200, 4500, 4700],
        [2200, 2300, 2400, 2600, 2800, 3000],
        [1400, 1500, 1600, 1700, 1800, 2000],
        [900, 950, 1000, 1100, 1200, 1300]
      ];
      return PROCESSES.map((name, i) => ({ name, values: sample[i] || Array(years.length).fill(0) }));
    }

    return PROCESSES.map((p, pi) => ({
      name: p,
      values: years.map((_, yi) => {
        const vals = selectedProjects.map(sp => projectSeedValue(sp, pi, yi));
        const avg = vals.reduce((s, v) => s + v, 0) / Math.max(1, vals.length);
        return Math.round(avg * (1 + yi * 0.12) * (1 + selectedProjects.length * 0.08) * 20);
      })
    }));
  }, [selectedProjects, years]);

  const normGrid = useMemo(() => normalizeGrid(grid), [grid]);
  const allValues = grid.flatMap(r => r.values);
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);

  return (
    <div className="bg-white rounded border p-4 shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold">Process Hotspots (Heatmap)</div>
          <div className="text-xs text-gray-500">Rows = processes, columns = years</div>
        </div>
        <div className="text-xs text-gray-500">Higher = darker</div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-hidden">
        <div className="flex-1">
          {/* Header row */}
          <div className="flex">
            <div className="flex-shrink-0 w-32 md:w-28" />
            {years.map(y => (
              <div key={y} className="flex-1 text-xs text-gray-600 text-center px-1">
                {y}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {normGrid.map(row => (
            <div key={row.name} className="flex items-center">
              <div className="flex-shrink-0 w-32 md:w-28 text-sm font-medium text-gray-700 pr-2">
                {row.name}
              </div>
              {row.values.map((v, i) => {
                const n = row.norm[i];
                const bg = colorForNorm(n);
                const textColor = n > 0.55 ? "text-white" : "text-gray-900";
                return (
                  <div
                    key={i}
                    title={`${row.name} — ${years[i]}: ${v}`}
                    className="flex-1 px-1 py-3 m-0.5 rounded flex items-center justify-center"
                    style={{
                      background: bg,
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.03)"
                    }}
                  >
                    <div className={`${textColor} text-sm font-semibold`}>
                      {v.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Compact legend below */}
      <div className="mt-4">
        <div className="text-xs text-gray-500 text-center mb-1">Scale</div>
        <div className="flex items-center justify-between w-full px-6">
          <span className="text-xs text-gray-600">
            Min: <strong>{minVal.toLocaleString()}</strong>
          </span>
          <div
            style={{
              flex: 1,
              height: 8,
              margin: "0 12px",
              borderRadius: 6,
              border: "1px solid #eee",
              background: "linear-gradient(to right, hsl(0 60% 85%), hsl(0 85% 35%))"
            }}
          />
          <span className="text-xs text-gray-600">
            Max: <strong>{maxVal.toLocaleString()}</strong>
          </span>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        Note: values are estimated from project metadata for visualization.
      </div>
    </div>
  );
}
