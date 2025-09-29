import React from "react";

export default function Tabs({ tabs = [], active, onChange }) {
  return (
    <div className="bg-white border rounded-lg">
      <div className="flex border-b px-2">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => onChange(t.key)} className={`px-4 py-3 text-sm font-medium ${active === t.key ? "border-b-2 border-indigo-600 text-indigo-700" : "text-gray-500"}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-4">{tabs.find((x) => x.key === active)?.content}</div>
    </div>
  );
}
