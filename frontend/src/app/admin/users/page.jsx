"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { FormModal } from "@/components/Modal";
import SkeletonTable from "@/components/SkeletonTable";
import URL from '../../../api';

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
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsConnected(false);
      router.push("/login");
      return;
    }
    setIsConnected(true);
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== "admin") {
      router.push("/login");
      return;
    }
    setLoading(true);
    fetch(`${URL}/admin/getusers?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.users)) {
          setUsers(data.users);
          setTotal(data.total);
        } else {
          setError("Erreur lors de la récupération des utilisateurs");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur serveur");
        setLoading(false);
      });
  }, [router, search, page, limit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const token = localStorage.getItem("token");
    const userPayload = {
      nom: form.nom || '',
      prenom: form.prenom || '',
      email: form.email || '',
      mot_de_passe: form.mot_de_passe || '',
      role: form.role || 'superviseur',
      telephone: form.telephone || '',
      adresse: form.adresse || null
    };
    const res = await fetch(`${URL}/admin/createUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(userPayload)
    });
    const data = await res.json();
    if (res.ok) {
      setShowModal(false);
      setForm({ nom: "", prenom: "", email: "", mot_de_passe: "", role: "superviseur", telephone: "", adresse: "" });
      setSuccess("Utilisateur ajouté avec succès !");
      // Ajout direct du nouvel utilisateur à la liste
      setUsers(prev => [{
        id_user: data.userId,
        nom: userPayload.nom,
        prenom: userPayload.prenom,
        role: userPayload.role
      }, ...prev]);
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
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
          <input
            type="text"
            placeholder="Rechercher par nom ou prénom..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          {loading ? (
            <SkeletonTable columns={4} rows={limit} />
          ) : (
            <table className="min-w-full divide-y divide-indigo-200">
              <thead className="bg-indigo-700">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Nom</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Prénom</th>
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
                    <td className="py-2 px-4">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-indigo-500 text-white disabled:bg-gray-300"
          >
            Précédent
          </button>
          <span>Page {page} / {Math.ceil(total / limit) || 1}</span>
          <button
            onClick={() => setPage(p => (p < Math.ceil(total / limit) ? p + 1 : p))}
            disabled={page >= Math.ceil(total / limit)}
            className="px-3 py-1 rounded bg-indigo-500 text-white disabled:bg-gray-300"
          >
            Suivant
          </button>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.telephone || ''}
            onChange={e => setForm(f => ({ ...f, telephone: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={form.adresse || ''}
            onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))}
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