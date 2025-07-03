import React from "react";

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Fond transparent, clic pour fermer */}
      <div
        className="absolute inset-0 bg-opacity-50 backdrop-blur-sm transition"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl z-50 animate-fade-in border border-indigo-100"
        onClick={e => e.stopPropagation()} // Empêche la fermeture si on clique dans le modal
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
          aria-label="Fermer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}