"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import Sidebar from "@/components/Sidebar";

export default function AdminHome() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsConnected(false);
      router.push("/login");
      return;
    }
    setIsConnected(true);
    // Vérifier le rôle
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== "admin") {
      router.push("/login");
      return;
    }
    fetch("http://localhost:5000/admin/getusers", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
        else setError("Erreur lors de la récupération des utilisateurs");
      })
      .catch(() => setError("Erreur serveur"));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsConnected(false);
    router.push("/login");
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role="admin" />
      {/* Main content */}
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-indigo-900">Gestion des utilisateurs</h1>
        </div>
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full divide-y divide-indigo-200">
            <thead className="bg-indigo-700">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Nom</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Prénom</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Rôle</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-indigo-100">
              {users.map((u) => (
                <tr
                  key={u.id_user}
                  className="hover:bg-indigo-50 transition cursor-pointer"
                  onClick={() => setSelectedUser(u)}
                >
                  <td className="py-2 px-4">{u.nom}</td>
                  <td className="py-2 px-4">{u.prenom}</td>
                  <td className="py-2 px-4">{u.email}</td>
                  <td className="py-2 px-4">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Modal open={!!selectedUser} onClose={() => setSelectedUser(null)}>
        {selectedUser && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-indigo-700">Détail utilisateur</h2>
            <div className="mb-2"><b>Nom :</b> {selectedUser.nom}</div>
            <div className="mb-2"><b>Prénom :</b> {selectedUser.prenom}</div>
            <div className="mb-2"><b>Email :</b> {selectedUser.email}</div>
            <div className="mb-2"><b>Rôle :</b> {selectedUser.role}</div>
            {/* Ajoute d'autres champs si besoin */}
          </div>
        )}
      </Modal>
    </div>
  );
}