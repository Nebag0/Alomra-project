"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsConnected(false);
      router.push("/login");
      return;
    }
    setIsConnected(true);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
      // Récupérer les infos utilisateur depuis l'API
      fetch(`http://localhost:5000/profil`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.id_user) setUser(data);
          else setError("Impossible de charger le profil.");
        })
        .catch(() => setError("Erreur serveur"));
    } catch {
      setError("Token invalide");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsConnected(false);
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role={role} />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-indigo-700">Mon Profil</h2>
          <Link
            href="/profil/motdepasse"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold transition"
          >
            Changer le mot de passe
          </Link>
        </div>
        <div className="bg-white rounded shadow p-6 max-w-lg">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {!user ? (
            <div>Chargement...</div>
          ) : (
            <div className="space-y-3">
              <div><b>Nom :</b> {user.nom}</div>
              <div><b>Prénom :</b> {user.prenom}</div>
              <div><b>Email :</b> {user.email}</div>
              <div><b>Rôle :</b> {user.role}</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}