"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isConnected, setIsConnected] = useState(true);
  const [role, setRole] = useState("admin");
  const router = useRouter();

  // Récupère le rôle depuis le token (optionnel)
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
    } catch {}
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (newPassword !== confirmPassword) {
      setMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/profil/motdepasse", {
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
    } else {
      setMessage(data.error || "Erreur lors du changement de mot de passe.");
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
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Changer le mot de passe</h2>
        <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 max-w-lg space-y-4">
          {message && <div className={message.includes("succès") ? "text-green-600" : "text-red-600"}>{message}</div>}
          <div>
            <label className="block font-semibold mb-1">Ancien mot de passe</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold transition"
          >
            Valider
          </button>
        </form>
      </main>
    </div>
  );
}