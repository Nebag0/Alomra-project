"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import SkeletonTable from "@/components/SkeletonTable";
import { FormModal } from "@/components/Modal";
import dayjs from 'dayjs';
import URL from '../../../api';

export default function AdminReclamations() {
  const [reclamations, setReclamations] = useState([]);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [motifs, setMotifs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nom_agent: "",
    motifIds: []
  });

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
    fetch(`${URL}/admin/reclamations?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
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
    fetch(`${URL}/admin/motifs`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setMotifs(data))
      .catch(() => setMotifs([]));
  }, [router, search, page, limit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={() => {
        localStorage.removeItem("token");
        setIsConnected(false);
        router.push("/login");
      }} role="admin" />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-indigo-900">Toutes les réclamations</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
          <input
            type="text"
            placeholder="Rechercher par nom ou prénom d'agent..."
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          {loading ? (
            <SkeletonTable columns={7} rows={limit} />
          ) : (
            <table className="min-w-full divide-y divide-indigo-200">
              <thead className="bg-indigo-700">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Agent</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Créée par</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-indigo-100">
                {reclamations.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-indigo-50 transition cursor-pointer"
                    onClick={() => router.push(`/admin/reclamations/${r.id}`)}
                  >
                    <td className="py-2 px-4">{r.nom_agent} {r.prenom_agent}</td>
                    <td className="py-2 px-4">{dayjs(r.date_reclamation).format('DD/MM/YYYY')}</td>
                    <td className="py-2 px-4">{r.superviseur_nom} {r.superviseur_prenom}</td>
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
        <FormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          title="Ajouter une réclamation"
          submitText="Ajouter"
          cancelText="Annuler"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motif(s)</label>
            <select
              multiple
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={form.motifIds}
              onChange={e => {
                const options = Array.from(e.target.selectedOptions, o => Number(o.value));
                setForm(f => ({ ...f, motifIds: options }));
              }}
              required
            >
              {motifs.map(motif => (
                <option key={motif.id} value={motif.id}>{motif.nom}</option>
              ))}
            </select>
          </div>
        </FormModal>
      </main>
    </div>
  );
}