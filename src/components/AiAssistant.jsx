import React from "react";

/**
 * AiAssistant
 * Props:
 *  - active: boolean (show/hide)
 *  - message: string
 *  - subMessage: string (optional)
 *  - onClose: fn (optional)
 */
export default function AiAssistant({ active, message, subMessage, onClose }) {
  if (!active) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      <div className="flex items-end gap-3">
        {/* Shoe/assistant avatar */}
        <div className="w-12 h-12 rounded-full bg-white border shadow-md flex items-center justify-center">
          <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 40c5-10 40-16 50-12v6c-10 8-30 8-44 10-6 .8-8-2-6-4z" fill="#06b6d4" />
            <path d="M54 30c2 2 2 6 2 6s-20-4-34 2c0 0 0-6 4-10 6-6 24-4 28 2z" fill="#ffffff" opacity="0.95" />
          </svg>
        </div>

        {/* bubble */}
        <div className="max-w-xs bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-100 text-blue-900 shadow-lg rounded-2xl p-3">
          <div className="flex items-start gap-2">
            <div className="text-sm font-semibold">PlanetFirst AI</div>
            <button onClick={onClose} className="ml-auto text-xs text-blue-600 hover:text-blue-800">×</button>
          </div>

          <div className="text-sm text-blue-800 mt-1 leading-tight">{message}</div>
          {subMessage && <div className="text-xs text-blue-700 mt-1">{subMessage}</div>}
          <div className="mt-2 text-[11px] text-blue-500">AI helper · Prototype</div>
        </div>
      </div>
    </div>
  );
}
