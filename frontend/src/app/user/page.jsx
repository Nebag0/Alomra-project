"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

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
      {/* Sidebar/Navbar */}
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role="superviseur" />
      {/* Topbar pour mobile */}
      <nav className="md:hidden flex items-center justify-between w-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white px-4 py-3 shadow-lg fixed top-0 left-0 z-30">
        <div className="flex items-center gap-2">
          <img src="/alomra.svg" alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-bold">Alomra</span>
        </div>
        {isConnected && (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition px-3 py-1 rounded text-white font-semibold text-sm"
          >
            Déconnexion
          </button>
        )}
      </nav>
      {/* Main content */}
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-indigo-900">Mes réclamations</h1>
          <Link
            href="/user/ajouter-reclamation"
            className="bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 text-white px-6 py-2 rounded shadow hover:from-indigo-700 hover:to-purple-600 transition font-semibold"
          >
            + Ajouter une réclamation
          </Link>
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
                <tr key={r.id} className="hover:bg-indigo-50 transition">
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
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-40 flex items-center justify-center">
            {/* Fond flouté et sombre mais visible */}
            <div
              className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition"
              onClick={() => setShowModal(false)}
            />
            <div className="relative bg-white rounded-lg shadow-2xl p-8 w-full max-w-lg z-50 animate-fade-in border border-indigo-100">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                aria-label="Fermer"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4 text-indigo-700">Ajouter une réclamation</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input name="nom_agent" value={form.nom_agent} onChange={handleChange} placeholder="Nom agent" className="w-full border rounded px-3 py-2 focus:outline-indigo-500" required />
                <input name="prenom_agent" value={form.prenom_agent} onChange={handleChange} placeholder="Prénom agent" className="w-full border rounded px-3 py-2 focus:outline-indigo-500" required />
                <input name="cin_agent" value={form.cin_agent} onChange={handleChange} placeholder="CIN agent" className="w-full border rounded px-3 py-2 focus:outline-indigo-500" required />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border rounded px-3 py-2 focus:outline-indigo-500" required />
                <input name="date_reclamation" type="date" value={form.date_reclamation} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-indigo-500" required />
                <input name="site_affectation" value={form.site_affectation} onChange={handleChange} placeholder="Site d'affectation" className="w-full border rounded px-3 py-2 focus:outline-indigo-500" required />
                <input name="poste" value={form.poste} onChange={handleChange} placeholder="Poste" className="w-full border rounded px-3 py-2 focus:outline-indigo-500" required />
                <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 text-white py-2 rounded hover:from-indigo-700 hover:to-purple-600 transition font-semibold">
                  Ajouter
                </button>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}