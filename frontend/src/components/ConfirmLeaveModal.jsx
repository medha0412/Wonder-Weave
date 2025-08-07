import React from "react";
import Modal from "react-modal";

export const ConfirmLeaveModal = ({ isOpen, onConfirm, onCancel }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onCancel}
    className="bg-white p-6 rounded-lg max-w-sm mx-auto shadow-lg"
    overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Are you sure you want to leave?</h2>
    <div className="flex justify-between mt-6">
      <button
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={onConfirm}
      >
        Yes, Leave
      </button>
    </div>
  </Modal>
);
