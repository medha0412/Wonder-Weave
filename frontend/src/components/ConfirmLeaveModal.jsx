import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); 

export const ConfirmLeaveModal = ({ isOpen, onConfirm, onCancel }) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onCancel}
    closeTimeoutMS={200} 
    className="bg-white p-6 rounded-xl max-w-sm w-full mx-auto shadow-xl transform transition-all scale-100"
    overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-200"
  >
    <h2 className="text-xl font-bold mb-4 text-center text-gray-800">
      Are you sure you want to leave?
    </h2>
    <p className="text-gray-600 text-center mb-6">
      You might lose any unsaved changes.
    </p>
    <div className="flex justify-center gap-4">
      <button
        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        onClick={onConfirm}
      >
        Yes, Leave
      </button>
    </div>
  </Modal>
);
