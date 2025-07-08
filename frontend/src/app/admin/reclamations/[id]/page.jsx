"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import dayjs from 'dayjs';

export default function ReclamationDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [reclamation, setReclamation] = useState(null);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsConnected(false);
    router.push("/login");
  };

  if (error) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role="admin" />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="text-red-500">{error}</div>
      </main>
    </div>
  );
  
  if (!reclamation) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role="admin" />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="p-4">Chargement...</div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role="admin" />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-indigo-700">Détail de la réclamation</h2>
              <button
                onClick={() => router.back()}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                ← Retour
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Nom de l'agent</label>
                  <p className="text-lg font-semibold">{reclamation.nom_agent}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Prénom de l'agent</label>
                  <p className="text-lg font-semibold">{reclamation.prenom_agent}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">CIN de l'agent</label>
                  <p className="text-lg font-semibold">{reclamation.cin_agent}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Date de réclamation</label>
                  <p className="text-lg font-semibold">{dayjs(reclamation.date_reclamation).format('DD/MM/YYYY')}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Site d'affectation</label>
                  <p className="text-lg font-semibold">{reclamation.site_affectation}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Poste</label>
                  <p className="text-lg font-semibold">{reclamation.poste}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-lg font-semibold mt-2">{reclamation.description}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-gray-600">Motif(s)</label>
                <p className="text-lg font-semibold mt-2">{reclamation.motifs}</p>
              </div>
            </div>
            
            {reclamation.superviseur_nom && (
              <div className="mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Créée par</label>
                  <p className="text-lg font-semibold mt-2">
                    {reclamation.superviseur_nom} {reclamation.superviseur_prenom}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}