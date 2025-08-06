import React from "react";

export default function Modal({ 
  open, 
  onClose, 
  children, 
  title, 
  size = "md", 
  showCloseButton = true,
  variant = "default" 
}) {
  if (!open) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full mx-4"
  };

  const variantClasses = {
    default: "bg-white",
    danger: "bg-red-50 border-red-200",
    success: "bg-green-50 border-green-200",
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fond avec effet blur */}
      <div
        className="absolute inset-0 bg-opacity-40 backdrop-blur-sm transition"
        onClick={onClose}
      />
      <div
        className={`relative ${variantClasses[variant]} rounded-lg shadow-2xl p-6 w-full ${sizeClasses[size]} z-50 animate-fade-in border border-gray-200 max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()} // Empêche la fermeture si on clique dans le modal
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold transition"
            aria-label="Fermer"
          >
            &times;
          </button>
        )}
        {title && (
          <h2 className="text-xl font-bold mb-4 text-indigo-700">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}

// Composants Modal spécialisés pour des cas d'usage courants
export function ConfirmModal({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Confirmation", 
  message, 
  confirmText = "Confirmer", 
  cancelText = "Annuler",
  variant = "default",
  showPasswordField = false,
  passwordValue = "",
  onPasswordChange = () => {},
  passwordPlaceholder = "Entrez votre mot de passe"
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} variant={variant}>
      <div className="text-center p-4">
        <p className="mb-4 text-gray-600 text-sm">{message}</p>
        
        {showPasswordField && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe administrateur
            </label>
            <input
              type="password"
              value={passwordValue}
              onChange={onPasswordChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder={passwordPlaceholder}
              required
            />
          </div>
        )}
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              variant === 'danger' 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : variant === 'success'
                ? 'bg-green-600 text-white hover:bg-green-700'
                : variant === 'warning'
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function FormModal({ 
  open, 
  onClose, 
  onSubmit, 
  title, 
  children, 
  submitText = "Enregistrer",
  cancelText = "Annuler",
  loading = false,
  size = "md"
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size={size}>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            {loading ? "Chargement..." : submitText}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition"
          >
            {cancelText}
          </button>
        </div>
      </form>
    </Modal>
  );
}