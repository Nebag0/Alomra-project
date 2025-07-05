"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AdminHome() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "", // <-- ici
    role: "superviseur"
  });
  const [success, setSuccess] = useState("");
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
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 text-white px-6 py-2 rounded shadow hover:from-indigo-700 hover:to-purple-600 transition font-semibold"
          >
            + Ajouter un utilisateur
          </button>
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
                  onClick={() => router.push(`/admin/users/${u.id_user}`)}
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
      {showModal && (
        <div className="flex items-center justify-center absolute inset-0 bg-opacity-40 backdrop-blur-sm transition bg-opacity-40 border border-indigo-900 border-solid">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-4 text-2xl text-gray-600"
              onClick={() => setShowModal(false)}
              aria-label="Fermer"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-indigo-700">Ajouter un utilisateur</h2>
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSuccess("");
                setError("");
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:5000/admin/createUser", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify(form)
                });
                const data = await res.json();
                if (res.ok) {
                  setShowModal(false);
                  setForm({ nom: "", prenom: "", email: "", mot_de_passe: "", role: "superviseur" });
                  // Affiche une alerte de succès
                  alert("Utilisateur ajouté !");
                  // Rafraîchir la liste des utilisateurs
                  fetch("http://localhost:5000/admin/getusers", {
                    headers: { Authorization: `Bearer ${token}` }
                  })
                    .then(res => res.json())
                    .then(data => {
                      if (Array.isArray(data)) setUsers(data);
                    });
                } else {
                  // Affiche une alerte d'erreur
                  alert(data.error || "Erreur lors de l'ajout.");
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-semibold mb-1">Nom</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={form.nom}
                  onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Prénom</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={form.prenom}
                  onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Mot de passe</label>
                <input
                  type="password"
                  className="w-full border rounded px-3 py-2"
                  value={form.mot_de_passe}
                  onChange={e => setForm(f => ({ ...f, mot_de_passe: e.target.value }))}
                  
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Rôle</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                >
                  <option value="superviseur">Superviseur</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold transition"
              >
                Ajouter
              </button>
            </form>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
}