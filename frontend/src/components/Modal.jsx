import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Fond avec effet blur */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50 animate-fade-in border border-gray-200"
        onClick={e => e.stopPropagation()} // Empêche la fermeture si on clique dans le modal
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold transition"
          aria-label="Fermer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}