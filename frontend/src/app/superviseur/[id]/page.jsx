"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Modal, ConfirmModal, FormModal } from "@/components/Modal";
import Sidebar from "@/components/Sidebar";
import DropdownMultiSelect from "@/components/DropdownMultiSelect";
import dayjs from 'dayjs';
import URL from '../../../api';

export default function ReclamationDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [reclamation, setReclamation] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [editForm, setEditForm] = useState({
    nom_agent: "",
    prenom_agent: "",
    cin_agent: "",
    description: "",
    date_reclamation: "",
    site_affectation: "",
    poste: ""
  });
  const [motifs, setMotifs] = useState([]);
  const [editMotifIds, setEditMotifIds] = useState([]);

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

    fetch(`${URL}/superviseur/reclamations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          setReclamation(data);
          setEditForm({
            nom_agent: data.nom_agent || "",
            prenom_agent: data.prenom_agent || "",
            cin_agent: data.cin_agent || "",
            description: data.description || "",
            date_reclamation: data.date_reclamation || "",
            site_affectation: data.site_affectation || "",
            poste: data.poste || ""
          });
        } else setError("Réclamation non trouvée");
      })
      .catch(() => setError("Erreur serveur"));

    fetch(`${URL}/superviseur/motifs`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => setMotifs(data))
      .catch(() => setMotifs([]));
  }, [id, router]);

  useEffect(() => {
    if (reclamation && reclamation.motifs && editMotifIds.length === 0) {
      const motifLabels = reclamation.motifs.split(',').map(m => m.trim());
      const motifIds = motifs.filter(m => motifLabels.includes(m.nom)).map(m => m.id);
      setEditMotifIds(motifIds);
    }
  }, [reclamation, motifs]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (editMotifIds.length === 0) {
      setError("Veuillez sélectionner au moins un motif.");
      return;
    }
    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split('.')[1]));
    let dateSQL = reclamation.date_reclamation;
    if (dateSQL && dateSQL.includes('T')) {
      dateSQL = dateSQL.split('T')[0];
    }
    const cleaned = {
      nom_agent: editForm.nom_agent || reclamation.nom_agent || "",
      prenom_agent: editForm.prenom_agent || reclamation.prenom_agent || "",
      cin_agent: editForm.cin_agent || reclamation.cin_agent || "",
      description: editForm.description || reclamation.description || "",
      date_reclamation: dateSQL || "",
      site_affectation: editForm.site_affectation || reclamation.site_affectation || "",
      poste: editForm.poste || reclamation.poste || "",
      created_by: payload.id,
      motifIds: editMotifIds
    };
    const res = await fetch(`${URL}/superviseur/reclamations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(cleaned)
    });
    const data = await res.json();
    if (res.ok) {
      setReclamation({ ...reclamation, ...cleaned });
      setShowEdit(false);
      setSuccess("Réclamation modifiée avec succès !");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(data.error || "Erreur lors de la modification.");
    }
  };

  const handleDelete = async () => {
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    const res = await fetch(`${URL}/superviseur/reclamations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.ok) {
      setSuccess("Réclamation supprimée avec succès !");
      setShowDeleteModal(false);
      setTimeout(() => {
        router.push("/superviseur");
      }, 2000);
    } else {
      const data = await res.json();
      setError(data.error || "Erreur lors de la suppression.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsConnected(false);
    router.push("/login");
  };

  if (error) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role="superviseur" />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="text-red-500">{error}</div>
      </main>
    </div>
  );
  
  if (!reclamation) return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role="superviseur" />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="p-4">Chargement...</div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role="superviseur" />
      
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-indigo-700">Détail de la demaned de sanction disciplinaire</h2>
              <button
                onClick={() => router.back()}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                ← Retour
              </button>
            </div>
            
            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}
            
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
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-600">Motif(s)</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {reclamation.motifs && reclamation.motifs.split(',').map((motif, idx) => (
                  <span key={idx} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-semibold">
                    {motif.trim()}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-600">Créée par</label>
              <p className="text-lg font-semibold mt-2">{reclamation.superviseur_nom} {reclamation.superviseur_prenom}</p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowEdit(true)}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modal d'édition */}
      <FormModal 
        open={showEdit} 
        onClose={() => setShowEdit(false)}
        onSubmit={handleEdit}
        title="Modifier la réclamation"
        submitText="Enregistrer"
        cancelText="Annuler"
        size="lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'agent</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={editForm.nom_agent}
              onChange={e => setEditForm(f => ({ ...f, nom_agent: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom de l'agent</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={editForm.prenom_agent}
              onChange={e => setEditForm(f => ({ ...f, prenom_agent: e.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">CIN de l'agent</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={editForm.cin_agent}
              onChange={e => setEditForm(f => ({ ...f, cin_agent: e.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={editForm.description}
              onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
              required
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site d'affectation</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={editForm.site_affectation}
              onChange={e => setEditForm(f => ({ ...f, site_affectation: e.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={editForm.poste}
              onChange={e => setEditForm(f => ({ ...f, poste: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motif(s)</label>
            <DropdownMultiSelect
              options={motifs}
              value={editMotifIds}
              onChange={setEditMotifIds}
              placeholder="Choisir un ou plusieurs motifs..."
            />
            {editMotifIds.length === 0 && <div className="text-red-500 text-xs mt-1">Veuillez sélectionner au moins un motif.</div>}
          </div>
        </div>
        {error && <div className="text-red-600 mt-3 text-sm">{error}</div>}
      </FormModal>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette réclamation ? Cette action est irréversible."
        confirmText="Confirmer la suppression"
        cancelText="Annuler"
        variant="danger"
      />
    </div>
  );
} 