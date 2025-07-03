"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function UserDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

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
        if (data && data.id_user) setUser(data);
        else setError("Utilisateur non trouvé");
      })
      .catch(() => setError("Erreur serveur"));
  }, [id, router]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!user) return <div>Chargement...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Détail utilisateur</h2>
      <div className="mb-2"><b>Nom :</b> {user.nom}</div>
      <div className="mb-2"><b>Prénom :</b> {user.prenom}</div>
      <div className="mb-2"><b>Email :</b> {user.email}</div>
      <div className="mb-2"><b>Rôle :</b> {user.role}</div>
      <div className="mb-2"><b>Photo :</b> {user.photo}</div>
      {/* Ajoute d'autres champs si besoin */}
      <button
        onClick={() => router.back()}
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Retour
      </button>
    </div>
  );
}