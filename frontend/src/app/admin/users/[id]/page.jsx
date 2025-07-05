"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Modal from "../../../../components/Modal";
import Navbar from "../../../../components/Navbar";

export default function UserDetail() {
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
            role: data.role || ""
          });
        } else setError("Utilisateur non trouvé");
      })
      .catch(() => setError("Erreur serveur"));
  }, [id, router]);

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editConfirmPassword.trim()) {
      setError("Veuillez entrer votre mot de passe administrateur.");
      return;
    }

    setError("");
    setSuccess("");
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:5000/admin/updateuser/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...editForm,
        adminPassword: editConfirmPassword
      })
    });
    const data = await res.json();
    if (res.ok) {
      setUser({ ...user, ...editForm });
      setShowEditConfirmModal(false);
      setEditConfirmPassword("");
      setSuccess("Utilisateur modifié avec succès !");
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(data.error || "Erreur lors de la modification.");
    }
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

  if (error) return (
    <div>
      <Navbar />
      <div className="text-red-500 p-4">{error}</div>
    </div>
  );
  
  if (!user) return (
    <div>
      <Navbar />
      <div className="p-4">Chargement...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto mt-8 px-4">
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
            <button
              onClick={openDeleteModal}
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

      {/* Modal d'édition */}
      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-4 text-2xl text-gray-600 hover:text-gray-800"
              onClick={() => setShowEdit(false)}
              aria-label="Fermer"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-indigo-700">Modifier l'utilisateur</h2>
            <form onSubmit={handleEdit} className="space-y-4">
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
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Annuler
                </button>
              </div>
            </form>
            {error && <div className="text-red-600 mt-3 text-sm">{error}</div>}
          </div>
        </div>
      )}

      {/* Modal de confirmation pour modification */}
      <Modal open={showEditConfirmModal} onClose={() => setShowEditConfirmModal(false)}>
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold mb-4 text-indigo-600">
            Confirmer la modification
          </h3>
          <p className="mb-4 text-gray-600 text-sm">
            Êtes-vous sûr de vouloir modifier cet utilisateur ?
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe administrateur
            </label>
            <input
              type="password"
              value={editConfirmPassword}
              onChange={(e) => setEditConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowEdit(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
            >
              Continuer
            </button>
            <button
              onClick={() => {
                setShowEditConfirmModal(false);
                setEditConfirmPassword("");
                setError("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition"
            >
              Annuler
            </button>
          </div>
          {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
        </div>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="text-center p-4">
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Confirmer la suppression
          </h3>
          <p className="mb-4 text-gray-600 text-sm">
            Êtes-vous sûr de vouloir supprimer cet utilisateur ? 
            Cette action supprimera également toutes ses réclamations.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe administrateur
            </label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition"
            >
              Confirmer la suppression
            </button>
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setAdminPassword("");
                setError("");
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600 transition"
            >
              Annuler
            </button>
          </div>
          {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
        </div>
      </Modal>
    </div>
  );
}