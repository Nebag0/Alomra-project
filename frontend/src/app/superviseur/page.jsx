"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { FormModal } from "@/components/Modal";

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
    fetch("http://localhost:5000/superviseur/reclamations", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setReclamations(data);
        else setError("Erreur lors de la récupération des réclamations");
      })
      .catch(() => setError("Erreur serveur"));
  }, [router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    const body = { ...form, created_by: payload.id, motifIds: form.motifIds.length ? form.motifIds : [1] };
    try {
      const res = await fetch("http://localhost:5000/superviseur/reclamations", {
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
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-indigo-900">Mes réclamations</h1>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 text-white px-6 py-2 rounded shadow hover:from-indigo-700 hover:to-purple-600 transition font-semibold"
          >
            + Ajouter une réclamation
          </button>
        </div>
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
          <table className="min-w-full divide-y divide-indigo-200">
            <thead className="bg-indigo-700">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Nom agent</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Prénom agent</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Description</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Site</th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Poste</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-indigo-100">
              {reclamations.map((r) => (
                <tr 
                  key={r.id} 
                  className="hover:bg-indigo-50 transition cursor-pointer"
                  onClick={() => router.push(`/superviseur/${r.id}`)}
                >
                  <td className="py-2 px-4">{r.nom_agent}</td>
                  <td className="py-2 px-4">{r.prenom_agent}</td>
                  <td className="py-2 px-4">{r.description}</td>
                  <td className="py-2 px-4">{r.date_reclamation}</td>
                  <td className="py-2 px-4">{r.site_affectation}</td>
                  <td className="py-2 px-4">{r.poste}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal d'ajout de réclamation */}
        <FormModal 
          open={showModal} 
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          title="Ajouter une réclamation"
          submitText="Ajouter"
          cancelText="Annuler"
        >
          <input 
            name="nom_agent" 
            value={form.nom_agent} 
            onChange={handleChange} 
            placeholder="Nom agent" 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            required 
          />
          <input 
            name="prenom_agent" 
            value={form.prenom_agent} 
            onChange={handleChange} 
            placeholder="Prénom agent" 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            required 
          />
          <input 
            name="cin_agent" 
            value={form.cin_agent} 
            onChange={handleChange} 
            placeholder="CIN agent" 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            required 
          />
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            placeholder="Description" 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            required 
          />
          <input 
            name="date_reclamation" 
            type="date" 
            value={form.date_reclamation} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            required 
          />
          <input 
            name="site_affectation" 
            value={form.site_affectation} 
            onChange={handleChange} 
            placeholder="Site d'affectation" 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            required 
          />
          <input 
            name="poste" 
            value={form.poste} 
            onChange={handleChange} 
            placeholder="Poste" 
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            required 
          />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </FormModal>
      </main>
    </div>
  );
}