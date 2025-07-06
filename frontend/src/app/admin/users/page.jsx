"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { FormModal } from "@/components/Modal";

export default function AdminHome() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    mot_de_passe: "",
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

  const handleSubmit = async (e) => {
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
      setSuccess("Utilisateur ajouté avec succès !");
      // Rafraîchir la liste des utilisateurs
      fetch("http://localhost:5000/admin/getusers", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setUsers(data);
        });
    } else {
      setError(data.error || "Erreur lors de l'ajout.");
    }
  };

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
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
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

      {/* Modal d'ajout d'utilisateur */}
      <FormModal 
        open={showModal} 
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        title="Ajouter un utilisateur"
        submitText="Ajouter"
        cancelText="Annuler"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.nom}
            onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.prenom}
            onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.mot_de_passe}
            onChange={e => setForm(f => ({ ...f, mot_de_passe: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            required
          >
            <option value="superviseur">Superviseur</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </FormModal>
    </div>
  );
}