"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserEdit } from 'react-icons/fa';
import Modal from '@/components/Modal';
import URL from '../../api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editUser, setEditUser] = useState({ nom: '', prenom: '', email: '', telephone: '', adresse: '', role: '' });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsConnected(false);
      router.push("/login");
      return;
    }
    setIsConnected(true);
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setRole(payload.role);
      // Récupérer les infos utilisateur depuis l'API
      fetch(`${URL}/profil`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data && data.id_user) setUser(data);
          else setError("Impossible de charger le profil.");
        })
        .catch(() => setError("Erreur serveur"));
    } catch {
      setError("Token invalide");
    }
  }, [router]);

  useEffect(() => {
    if (user) {
      setEditUser({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || '',
        adresse: user.adresse || '',
        role: user.role || ''
      });
    }
  }, [user]);

  function handleEditChange(e) { setEditUser({ ...editUser, [e.target.name]: e.target.value }); }

  async function handleEditSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await fetch(`${URL}/profil`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editUser)
      });
      setShowEdit(false);
      location.reload();
    } catch {
      alert('Erreur lors de la mise à jour du profil');
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsConnected(false);
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role={role} />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8 flex justify-center items-center min-h-[80vh]">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-xl w-full flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            <FaUser className="text-indigo-500 text-5xl" />
          </div>
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">Mon Profil</h2>
          <div className="space-y-3 w-full text-gray-700 text-lg mb-6">
            <div className="flex items-center gap-2"><b>Nom :</b> {user?.nom}</div>
            <div className="flex items-center gap-2"><b>Prénom :</b> {user?.prenom}</div>
            <div className="flex items-center gap-2"><FaEnvelope className="text-indigo-400" /><span><b>Email :</b> {user?.email}</span></div>
            <div className="flex items-center gap-2"><b>Rôle :</b> {user?.role}</div>
            <div className="flex items-center gap-2"><FaPhone className="text-indigo-400" /><span><b>Téléphone :</b> {user?.telephone }</span></div>
            <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-indigo-400" /><span><b>Adresse :</b> {user?.adresse}</span></div>
          </div>
          <div className="flex gap-4 w-full">
            <a href="/profil/motdepasse" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold transition flex items-center justify-center gap-2"><FaUserEdit />Changer le mot de passe</a>
            <button className="flex-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded font-semibold transition flex items-center justify-center gap-2" onClick={() => setShowEdit(true)}><FaUserEdit />Modifier le profil</button>
          </div>
        </div>
      </main>
      {showEdit && (
        <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Modifier mon profil" size="md">
          <form className="space-y-4" onSubmit={handleEditSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input type="text" name="nom" value={editUser.nom} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <input type="text" name="prenom" value={editUser.prenom} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" name="email" value={editUser.email} onChange={handleEditChange} className="w-full border rounded px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <input type="text" name="telephone" value={editUser.telephone} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Adresse</label>
              <input type="text" name="adresse" value={editUser.adresse} onChange={handleEditChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="bg-gray-200 px-4 py-2 rounded" onClick={() => setShowEdit(false)}>Annuler</button>
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold">Enregistrer</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}