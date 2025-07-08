"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Modal, ConfirmModal, FormModal } from "../../../../components/Modal";
import Sidebar from "@/components/Sidebar";

export default function UserDetail() {
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditConfirmModal, setShowEditConfirmModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [editConfirmPassword, setEditConfirmPassword] = useState("");
  const [editForm, setEditForm] = useState({ nom: "", prenom: "", email: "", role: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  }, [router]);

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

    fetch(`http://localhost:5000/admin/getuser/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.id_user) {
          setUser(data);
          setEditForm({
            nom: data.nom || "",
            prenom: data.prenom || "",
            email: data.email || "",
            role: data.role || "",
            telephone: data.telephone || "",
            adresse: data.adresse || ""
          });
        } else setError("Utilisateur non trouvé");
      })
      .catch(() => setError("Erreur serveur"));
  }, [id, router]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/admin/updateuser/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(editForm)
    });
    const data = await res.json();
    if (res.ok) {
      setUser({ ...user, ...editForm });
      setShowEdit(false);
      setSuccess("Utilisateur modifié avec succès !");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(data.error || "Erreur lors de la modification.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsConnected(false);
    router.push("/login");
  };

  const handleDelete = async () => {
    if (!adminPassword.trim()) {
      setError("Veuillez entrer votre mot de passe administrateur.");
      return;
    }

    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/admin/deleteUserSecure/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ adminPassword })
    });
    
    const data = await res.json();
    if (res.ok) {
      setSuccess("Utilisateur supprimé avec succès !");
      setShowDeleteModal(false);
      setAdminPassword("");
      setTimeout(() => {
        router.push("/admin/users");
      }, 2000);
    } else {
      setError(data.error || "Erreur lors de la suppression.");
    }
  };

  const openDeleteModal = () => {
    if (user && user.role === 'admin') {
      setError("Vous ne pouvez pas supprimer un compte administrateur.");
      return;
    }
    setShowDeleteModal(true);
    setError("");
  };

  const openEditConfirmModal = () => {
    setShowEditConfirmModal(true);
    setError("");
  };

  const handleEditConfirm = async () => {
    if (!editConfirmPassword.trim()) {
      setError("Veuillez entrer votre mot de passe administrateur.");
      return;
    }

    setError("");
    const token = localStorage.getItem("token");
    
    // Vérifier le mot de passe avant d'ouvrir le modal de modification
    try {
      const res = await fetch(`http://localhost:5000/admin/verifyPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ adminPassword: editConfirmPassword })
      });
      
      const data = await res.json();
      if (res.ok) {
        setShowEditConfirmModal(false);
        setShowEdit(true);
        setError("");
      } else {
        setError(data.error || "Mot de passe administrateur incorrect.");
        setEditConfirmPassword("");
        setShowEditConfirmModal(false);
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
      setEditConfirmPassword("");
      setShowEditConfirmModal(false);
    }
  };

  if (!user) return (
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
              <h2 className="text-3xl font-bold text-indigo-700">Détail utilisateur</h2>
              <button
                onClick={() => router.back()}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                ← Retour
              </button>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                {success}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Nom</label>
                  <p className="text-lg font-semibold">{user.nom}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Prénom</label>
                  <p className="text-lg font-semibold">{user.prenom}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Téléphone</label>
                  <p className="text-lg font-semibold">{user.telephone}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Adresse</label>
                  <p className="text-lg font-semibold">{user.adresse}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-lg font-semibold">{user.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-medium text-gray-600">Rôle</label>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role === 'admin' ? 'Administrateur' : 'Superviseur'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={openEditConfirmModal}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Modifier
              </button>
              {user.role === 'admin' ? (
                <button
                  disabled
                  className="bg-gray-400 text-gray-600 px-6 py-3 rounded-lg cursor-not-allowed flex items-center"
                  title="Les comptes administrateur ne peuvent pas être supprimés"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer (Non autorisé)
                </button>
              ) : (
                <button
                  onClick={openDeleteModal}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </button>
              )}
            </div>
            
            {user.role === 'admin' && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-yellow-800 text-sm font-medium">
                    Les comptes administrateur ne peuvent pas être supprimés pour des raisons de sécurité.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal d'édition */}
      <FormModal 
        open={showEdit} 
        onClose={() => setShowEdit(false)}
        onSubmit={handleEdit}
        title="Modifier l'utilisateur"
        submitText="Enregistrer"
        cancelText="Annuler"
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={editForm.nom}
              onChange={e => setEditForm(f => ({ ...f, nom: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={editForm.prenom}
              onChange={e => setEditForm(f => ({ ...f, prenom: e.target.value }))}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={editForm.telephone || ''}
            onChange={e => setEditForm(f => ({ ...f, telephone: e.target.value }))}
            placeholder="Téléphone"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={editForm.adresse || ''}
            onChange={e => setEditForm(f => ({ ...f, adresse: e.target.value }))}
            placeholder="Adresse"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={editForm.email}
            onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={editForm.role}
            onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
            required
          >
            <option value="superviseur">Superviseur</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {error && <div className="text-red-600 mt-3 text-sm">{error}</div>}
      </FormModal>

      {/* Modal de confirmation pour modification */}
      <ConfirmModal
        open={showEditConfirmModal}
        onClose={() => {
          setShowEditConfirmModal(false);
          setEditConfirmPassword("");
          setError("");
        }}
        onConfirm={handleEditConfirm}
        title="Confirmer la modification"
        message="Êtes-vous sûr de vouloir modifier cet utilisateur ?"
        confirmText="Continuer"
        cancelText="Annuler"
        showPasswordField={true}
        passwordValue={editConfirmPassword}
        onPasswordChange={(e) => setEditConfirmPassword(e.target.value)}
        passwordPlaceholder="Entrez votre mot de passe"
      />

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setAdminPassword("");
          setError("");
        }}
        onConfirm={handleDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action supprimera également toutes ses réclamations."
        confirmText="Confirmer la suppression"
        cancelText="Annuler"
        variant="danger"
        showPasswordField={true}
        passwordValue={adminPassword}
        onPasswordChange={(e) => setAdminPassword(e.target.value)}
        passwordPlaceholder="Entrez votre mot de passe"
      />
    </div>
  );
}