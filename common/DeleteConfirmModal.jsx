import React from "react";


export default function DeleteConfirmModal({ isOpen, title, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
        {/* Close icon */}
        <button
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          onClick={onCancel}
        >
          ✕
        </button>

        <h2 className="font-semibold text-lg mb-2">Delete</h2>
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete the{" "}
          <span className="font-medium">{title || "widget"}</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 border rounded-md"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={onConfirm}

            
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
}
