// src/components/common/ConfirmationDialog.jsx
import React from "react";

const ConfirmationDialog = ({ isOpen, title = "Confirm", message = "", onClose = () => {}, onConfirm = () => {}, isLoading = false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <p className="text-sm text-gray-700 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded text-white ${isLoading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"}`}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
