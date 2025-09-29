import React from "react";

export default function ProgressBar({ step = 1, total = 4 }) {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div className="mb-10 flex items-center justify-between relative">
      {steps.map((s, idx) => {
        const isCompleted = s < step;
        const isActive = s === step;

        return (
          <div key={s} className="flex-1 flex flex-col items-center relative">
            {/* Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold z-10 ${
                isCompleted
                  ? "bg-green-600 text-white"
                  : isActive
                  ? "bg-indigo-600 text-white"
                  : "bg-white border"
              }`}
            >
              {s}
            </div>

            {/* Label */}
            <div className="mt-1 text-center text-xs sm:text-sm">
              {s === 1
                ? "Project Details"
                : s === 2
                ? "Metals & Lifecycle"
                : s === 3
                ? "Goals & Scenarios"
                : "Review & Submit"}
            </div>

            {/* Connecting line (only for all except last circle) */}
            {idx < total - 1 && (
              <div className="absolute top-4 left-1/2 right-[-50%] h-1 flex">
                {/* Gray background line */}
                <div className="w-full h-1 bg-gray-200 rounded"></div>
                {/* Filled line */}
                <div
                  className="h-1 bg-green-600 rounded absolute top-0 left-0"
                  style={{ width: isCompleted ? "100%" : "0%", transition: "width 0.3s ease" }}
                ></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
