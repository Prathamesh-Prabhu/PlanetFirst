import React from "react";
import ProgressBar from "./ProgressBar";

export default function FormStepper({ step, setStep, children, onNext, onPrev, isLast }) {
  return (
    <div>
      <ProgressBar step={step} total={4} />

      <div className="mt-4">{children}</div>

      {/* Step Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 border-t pt-4 gap-2">
        {/* Back Button */}
        {step > 1 ? (
          <button
            className="px-4 py-2 w-full sm:w-auto rounded bg-white border text-gray-700 hover:bg-gray-100"
            onClick={() => {
              setStep(step - 1);
              if (onPrev) onPrev();
            }}
          >
            ← Back
          </button>
        ) : (
          <div className="w-full sm:w-auto" /> // placeholder to keep spacing
        )}

        {/* Next / Submit Button */}
        <button
          className={`px-4 py-2 w-full sm:w-auto rounded text-white ${
            isLast ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
          onClick={onNext}
        >
          {!isLast
            ? `Next: ${
                step === 1
                  ? "Metals & Lifecycle"
                  : step === 2
                  ? "Goals & Scenarios"
                  : "Review & Submit"
              } →`
            : "Generate Assessment Report"}
        </button>
      </div>
    </div>
  );
}
