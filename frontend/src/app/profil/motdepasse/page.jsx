"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import URL from '../../../api';

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Récupère le rôle depuis le token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsConnected(false);
      router.push("/login");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
    } catch {
      setRole("superviseur");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Validation des mots de passe
    if (newPassword.length < 6) {
      setMessage("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Les nouveaux mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (oldPassword === newPassword) {
      setMessage("Le nouveau mot de passe doit être différent de l'ancien.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${URL}/profil/motdepasse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage("Mot de passe changé avec succès !");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setMessage(""), 5000);
      } else {
        setMessage(data.error || "Erreur lors du changement de mot de passe.");
      }
    } catch (error) {
      setMessage("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsConnected(false);
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role={role} />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-indigo-700 mb-2">Changer le mot de passe</h2>
              <p className="text-gray-600">Sécurisez votre compte en changeant votre mot de passe</p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg border ${
                message.includes("succès") 
                  ? "bg-green-100 border-green-400 text-green-700" 
                  : "bg-red-100 border-red-400 text-red-700"
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ancien mot de passe
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe actuel"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Entrez votre nouveau mot de passe"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre nouveau mot de passe"
                  required
                  disabled={loading}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Conseils de sécurité :</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Utilisez au moins 8 caractères</li>
                  <li>• Incluez des lettres majuscules et minuscules</li>
                  <li>• Ajoutez des chiffres et des symboles</li>
                  <li>• Évitez les informations personnelles</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Modification en cours...
                  </div>
                ) : (
                  "Modifier le mot de passe"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}