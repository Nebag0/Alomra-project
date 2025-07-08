"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import dayjs from 'dayjs';

export default function AdminDashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsConnected(false);
      router.push("/login");
      return;
    }
    setIsConnected(true);
    let url = 'http://localhost:5000/admin/reclamations/stats/mois';
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsConnected(false);
    router.push("/login");
  };

  const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
  const chartData = Array(12).fill(0);
  data.forEach(item => {
    const month = dayjs(item.mois).month();
    chartData[month] = item.count;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={isConnected} handleLogout={handleLogout} role="admin" />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">Bienvenue sur le Dashboard Admin</h1>
        <div className="text-lg text-gray-700 mb-8">Analyse des réclamations par mois</div>
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl mx-auto">
          <div className="font-semibold text-lg mb-4">Réclamations par mois</div>
          <div className="overflow-x-auto">
            <div className="flex items-end h-80 space-x-6 mb-8 px-8 min-w-[600px]">
              {chartData.map((count, i) => (
                <div key={i} className="flex flex-col items-center w-12 group cursor-pointer">
                  <div
                    className="bg-indigo-400 group-hover:bg-indigo-600 transition-all duration-200 w-full rounded-t-xl shadow-md relative"
                    style={{ height: `${count * 16}px`, minHeight: '10px' }}
                  >
                    {count > 0 && (
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-700 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg z-10">
                        {count} réclamations
                      </span>
                    )}
                  </div>
                  <span className="text-xs mt-3 text-gray-700 font-medium">{months[i].slice(0,3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}