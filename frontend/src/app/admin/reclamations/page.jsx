"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function AdminReclamations() {
  const [reclamations, setReclamations] = useState([]);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsConnected(false);
      router.push("/login");
      return;
    }
    setIsConnected(true);
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== "admin") {
      router.push("/login");
      return;
    }
    fetch("http://localhost:5000/admin/reclamations", {
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={() => {
        localStorage.removeItem("token");
        setIsConnected(false);
        router.push("/login");
      }} role="admin" />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-indigo-900">Toutes les réclamations</h1>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
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
                <th className="py-3 px-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Créée par (superviseur)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-indigo-100">
              {reclamations.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-indigo-50 transition cursor-pointer"
                  onClick={() => router.push(`/admin/reclamations/${r.id}`)}
                >
                  <td className="py-2 px-4">{r.nom_agent}</td>
                  <td className="py-2 px-4">{r.prenom_agent}</td>
                  <td className="py-2 px-4">{r.description}</td>
                  <td className="py-2 px-4">{r.date_reclamation}</td>
                  <td className="py-2 px-4">{r.site_affectation}</td>
                  <td className="py-2 px-4">{r.poste}</td>
                  <td className="py-2 px-4">
                    {r.superviseur_nom} {r.superviseur_prenom}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}