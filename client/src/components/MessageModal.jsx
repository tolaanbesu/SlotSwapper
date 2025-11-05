// components/Layout/MessageModal.jsx
import React from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

export default function MessageModal({ message, handleConfirm }) {
  if (!message) return null;

  const isAlert = message.type === "alert";
  const Icon = isAlert ? AlertTriangle : CheckCircle;
  const color = isAlert ? "bg-yellow-500" : "bg-blue-500";

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm transform transition-all">
        <div className={`p-4 rounded-t-xl ${color}`}>
          <Icon className="w-8 h-8 text-white mx-auto" />
        </div>
        <div className="p-6 text-center">
          <p className="text-lg font-semibold mb-6 text-gray-800">{message.text}</p>

          <div className="flex justify-center space-x-3">
            {isAlert ? (
              <button
                onClick={() => handleConfirm(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                OK
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleConfirm(false)}
                  className="w-1/2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleConfirm(true)}
                  className="w-1/2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Confirm
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
