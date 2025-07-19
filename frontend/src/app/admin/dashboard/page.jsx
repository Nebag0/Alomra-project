"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import dayjs from 'dayjs';
import URL from '../../../api';
import Modal, { FormModal, ConfirmModal } from '@/components/Modal';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from 'recharts';
import { useMemo } from 'react';

export default function AdminDashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Gestion des emails à notifier
  const [emails, setEmails] = useState([]);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [addError, setAddError] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Suppression d'un email sécurisée
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [emailIdToDelete, setEmailIdToDelete] = useState(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [selectedYear, setSelectedYear] = useState('');
  const [chartType, setChartType] = useState('bar'); // 'bar' ou 'line'

  // Extraire les années disponibles à partir des données
  const years = useMemo(() => {
    const set = new Set();
    data.forEach(item => {
      if (item.mois) set.add(item.mois.slice(0, 4));
    });
    return Array.from(set).sort();
  }, [data]);

  // Définir l'année sélectionnée par défaut (la plus récente)
  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(years[years.length - 1]);
    }
  }, [years, selectedYear]);

  // Préparer les données du graphique pour l'année sélectionnée
  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const chartData = useMemo(() => {
    // Initialiser chaque mois à 0
    const arr = months.map((name, i) => ({
      mois: name.slice(0, 3),
      count: 0,
      fullMonth: name,
      monthIndex: i
    }));
    data.forEach(item => {
      if (item.mois && item.mois.startsWith(selectedYear)) {
        const monthIdx = parseInt(item.mois.slice(5, 7), 10) - 1;
        if (arr[monthIdx]) arr[monthIdx].count = item.count;
      }
    });
    return arr;
  }, [data, selectedYear]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsConnected(false);
      router.push("/login");
      return;
    }
    setIsConnected(true);
    let url = `${URL}/admin/reclamations/stats/mois`;
    setLoading(true);
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setError("Erreur lors du chargement des statistiques");
        setLoading(false);
      });
  }, [router]);

  // Charger les emails à notifier
  useEffect(() => {
    const fetchEmails = async () => {
      setEmailLoading(true);
      setEmailError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${URL}/admin/notification-emails`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Erreur lors du chargement des emails");
        const data = await res.json();
        setEmails(data);
      } catch (err) {
        setEmailError("Erreur lors du chargement des emails à notifier");
      } finally {
        setEmailLoading(false);
      }
    };
    fetchEmails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsConnected(false);
    router.push("/login");
  };

  // Suppression d'un email sécurisée
  const openDeleteModal = (id) => {
    setEmailIdToDelete(id);
    setAdminPassword("");
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const handleDeleteEmail = async () => {
    if (!adminPassword.trim()) {
      setDeleteError("Veuillez entrer votre mot de passe administrateur.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${URL}/admin/notification-emails/${emailIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ adminPassword })
      });
      if (res.status === 204) {
        setEmails(emails.filter(e => e.id !== emailIdToDelete));
        setShowDeleteModal(false);
        setEmailIdToDelete(null);
        setAdminPassword("");
        setDeleteError("");
      } else {
        const data = await res.json();
        setDeleteError(data.error || "Erreur lors de la suppression");
        // Le modal reste ouvert
      }
    } catch {
      setDeleteError("Erreur lors de la suppression");
      // Le modal reste ouvert
    }
  };

  // Ajout d'un email
  const handleAddEmail = async (e) => {
    e.preventDefault();
    setAddError("");
    if (!newEmail.match(/^\S+@\S+\.\S+$/)) {
      setAddError("Email invalide");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${URL}/admin/notification-emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: newEmail })
      });
      if (res.status === 201) {
        const data = await res.json();
        setEmails([...emails, { id: data.id, email: data.email }]);
        setShowAddModal(false);
        setNewEmail("");
      } else if (res.status === 409) {
        setAddError("Cet email existe déjà.");
      } else {
        setAddError("Erreur lors de l'ajout");
      }
    } catch {
      setAddError("Erreur lors de l'ajout");
    }
  };

  // Pagination
  const totalPages = Math.ceil(emails.length / rowsPerPage);
  const paginatedEmails = emails.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role="admin" />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-2 md:px-12 py-8">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">Bienvenue sur le Dashboard Admin</h1>
        <div className="text-lg text-gray-700 mb-8">Analyse des réclamations par mois</div>
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 w-full max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="font-semibold text-lg">Réclamations par mois</div>
            <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
              <label className="text-sm font-medium">Année :
                <select
                  className="ml-2 border border-gray-300 rounded px-2 py-1"
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="radio"
                  name="chartType"
                  value="bar"
                  checked={chartType === 'bar'}
                  onChange={() => setChartType('bar')}
                />
                Barres
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="radio"
                  name="chartType"
                  value="line"
                  checked={chartType === 'line'}
                  onChange={() => setChartType('line')}
                />
                Ligne
              </label>
            </div>
          </div>
          <div className="w-full" style={{ minHeight: 320 }}>
            <ResponsiveContainer width="100%" height={320}>
              {chartType === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={v => `${v} réclamations`} />
                  <Legend />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40}>
                    <LabelList dataKey="count" position="top" formatter={v => v > 0 ? v : ''} />
                  </Bar>
                </BarChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={v => `${v} réclamations`} />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} dot={{ r: 6, fill: '#6366f1' }} activeDot={{ r: 8 }}>
                    <LabelList dataKey="count" position="top" formatter={v => v > 0 ? v : ''} />
                  </Line>
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
        {/* Tableau des emails à notifier */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl mx-auto mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="font-semibold text-lg">Emails à notifier lors d'une nouvelle réclamation</div>
            <button onClick={() => setShowAddModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Ajouter un email</button>
          </div>
          {emailError && <div className="text-red-500 mb-2">{emailError}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {emailLoading ? (
                  <tr><td colSpan={2} className="text-center py-8">Chargement...</td></tr>
                ) : paginatedEmails.length === 0 ? (
                  <tr><td colSpan={2} className="text-center py-8">Aucun email à notifier</td></tr>
                ) : paginatedEmails.map(email => (
                  <tr key={email.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{email.email}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openDeleteModal(email.id)} className="text-red-600 hover:text-red-800 font-bold">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Précédent</button>
              <span className="mx-2">Page {page} / {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50">Suivant</button>
            </div>
          )}
        </div>
        {/* Modal d'ajout d'email */}
        <FormModal
          open={showAddModal}
          onClose={() => { setShowAddModal(false); setAddError(""); setNewEmail(""); }}
          onSubmit={handleAddEmail}
          title="Ajouter un email à notifier"
          submitText="Ajouter"
        >
          <input
            type="email"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            placeholder="exemple@email.com"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            required
          />
          {addError && <div className="text-red-500 mb-2">{addError}</div>}
        </FormModal>
        {/* Modal de confirmation de suppression avec mot de passe */}
        <ConfirmModal
          open={showDeleteModal}
          onClose={() => { setShowDeleteModal(false); setDeleteError(""); setAdminPassword(""); }}
          onConfirm={handleDeleteEmail}
          title="Confirmer la suppression"
          message={<span>Pour supprimer cet email des notifications, veuillez entrer votre mot de passe administrateur.<br/>{deleteError && <span className='text-red-500 block mt-2'>{deleteError}</span>}</span>}
          confirmText="Supprimer"
          cancelText="Annuler"
          variant="danger"
          showPasswordField={true}
          passwordValue={adminPassword}
          onPasswordChange={e => setAdminPassword(e.target.value)}
        />
        {deleteError && <div className="text-red-500 mt-2 text-center">{deleteError}</div>}
      </main>
    </div>
  );
}