"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ReclamationDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [reclamation, setReclamation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetch(`http://localhost:5000/admin/reclamations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.id) setReclamation(data);
        else setError("Réclamation non trouvée");
      })
      .catch(() => setError("Erreur serveur"));
  }, [id, router]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!reclamation) return <div>Chargement...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={true} handleLogout={() => {}} role="admin" />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Détail de la réclamation</h2>
        <div className="bg-white rounded shadow p-6">
          <div><b>Nom agent :</b> {reclamation.nom_agent}</div>
          <div><b>Prénom agent :</b> {reclamation.prenom_agent}</div>
          <div><b>CIN agent :</b> {reclamation.cin_agent}</div>
          <div><b>Description :</b> {reclamation.description}</div>
          <div><b>Date :</b> {reclamation.date_reclamation}</div>
          <div><b>Site :</b> {reclamation.site_affectation}</div>
          <div><b>Poste :</b> {reclamation.poste}</div>
          <div><b>Créée par :</b> {reclamation.superviseur_nom} {reclamation.superviseur_prenom}</div>
        </div>
        <button
          onClick={() => router.back()}
          className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Retour
        </button>
      </main>
    </div>
  );
}