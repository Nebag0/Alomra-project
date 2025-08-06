"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { FormModal } from "@/components/Modal";
import DropdownMultiSelect from "@/components/DropdownMultiSelect";
import URL from '../../api';

export default function UserHome() {
  const [reclamations, setReclamations] = useState([]);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nom_agent: "",
    prenom_agent: "",
    cin_agent: "",
    description: "",
    date_reclamation: "",
    site_affectation: "",
    poste: "",
    motifIds: [],
  });
  const [success, setSuccess] = useState("");
  const [motifs, setMotifs] = useState([]);
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
    // Vérifier le rôle
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== "superviseur") {
      router.push("/login");
      return;
    }
    setLoading(true);
    fetch(`${URL}/superviseur/reclamations?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.reclamations)) {
          setReclamations(data.reclamations);
          setTotal(data.total);
        } else {
          setError("Erreur lors de la récupération des réclamations");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur serveur");
        setLoading(false);
      });
    // Récupérer la liste des motifs
    fetch(`${URL}/superviseur/motifs`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setMotifs(data))
      .catch(() => setMotifs([]));
  }, [router, search, page, limit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (form.motifIds.length === 0) {
      setError("Veuillez sélectionner au moins un motif.");
      return;
    }
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    const body = { ...form, created_by: payload.id, motifIds: form.motifIds.length ? form.motifIds : [1] };
    try {
      const res = await fetch(`${URL}/superviseur/reclamations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        setShowModal(false);
        setSuccess("Réclamation ajoutée avec succès !");
        setTimeout(() => setSuccess(""), 2000);
        window.location.reload();
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'ajout");
      }
    } catch {
      setError("Erreur serveur");
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
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role="superviseur" />

      {/* Main content */}
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8 mt-5">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-indigo-900">Mes demandes de sanctions disciplinaires</h1>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 text-white px-6 py-2 rounded shadow hover:from-indigo-700 hover:to-purple-600 transition font-semibold"
          >
            + Ajouter une demande
          </button>
        </div>
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
          <input
            type="text"
            placeholder="Rechercher par nom ou prénom d'agent..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full divide-y divide-indigo-200">
            <thead className="bg-indigo-700">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Agent</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Site d'affectation</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Motif(s)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-indigo-100">
              {reclamations.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-indigo-50 transition cursor-pointer"
                  onClick={() => router.push(`/superviseur/${r.id}`)}
                >
                  <td className="py-2 px-4">{r.nom_agent} {r.prenom_agent}</td>
                  <td className="py-2 px-4">{r.site_affectation}</td>
                  <td className="py-2 px-4">{r.motifs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        <FormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          title="Ajouter une demande de sanction disciplinaire"
          submitText="Ajouter"
          cancelText="Annuler"
          size="lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'agent *</label>
              <input
                name="nom_agent"
                value={form.nom_agent}
                onChange={handleChange}
                placeholder="Nom de l'agent"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom de l'agent *</label>
              <input
                name="prenom_agent"
                value={form.prenom_agent}
                onChange={handleChange}
                placeholder="Prénom de l'agent"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CIN de l'agent</label>
              <input
                name="cin_agent"
                value={form.cin_agent}
                onChange={handleChange}
                placeholder="CIN de l'agent"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de la sanction *</label>
              <input
                name="date_reclamation"
                type="date"
                value={form.date_reclamation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site d'affectation *</label>
              <input
                name="site_affectation"
                value={form.site_affectation}
                onChange={handleChange}
                placeholder="Site d'affectation"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poste *</label>
              <input
                name="poste"
                value={form.poste}
                onChange={handleChange}
                placeholder="Poste de l'agent"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Motif(s) *</label>
              <DropdownMultiSelect
                options={motifs}
                value={form.motifIds}
                onChange={motifIds => setForm(f => ({ ...f, motifIds }))}
                placeholder="Choisir un ou plusieurs motifs..."
              />
              {form.motifIds.length === 0 && <div className="text-red-500 text-xs mt-1">Veuillez sélectionner au moins un motif.</div>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description/Observation</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description détaillée de la sanction..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows="4"
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </FormModal>
      </main>
    </div>
  );
}