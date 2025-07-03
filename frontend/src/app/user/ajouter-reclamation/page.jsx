"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AjouterReclamation() {
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
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
        setSuccess("Réclamation ajoutée avec succès !");
        setTimeout(() => router.push("/user"), 1500);
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'ajout");
      }
    } catch {
      setError("Erreur serveur");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700 text-center">Ajouter une réclamation</h2>
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
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
        </form>
      </div>
    </div>
  );
}