"use client";

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import URL from '../../api';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${URL}/reclamations/stats/mois`)
      .then(res => res.json())
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des statistiques');
        setLoading(false);
      });
  }, []);

  // Générer les labels des mois
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Préparer les données pour le graphique
  const chartData = Array(12).fill(0);
  data.forEach(item => {
    const month = dayjs(item.mois).month();
    chartData[month] = item.count;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8 text-indigo-700">Dashboard des réclamations (par mois)</h1>
      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {/* Graphique simple en barres (CSS) */}
          <div className="flex items-end h-64 space-x-2 mb-8">
            {chartData.map((count, i) => (
              <div key={i} className="flex flex-col items-center w-8">
                <div
                  className="bg-indigo-500 w-full rounded-t"
                  style={{ height: `${count * 10}px`, minHeight: '8px' }}
                  title={`${months[i]}: ${count}`}
                ></div>
                <span className="text-xs mt-2 text-gray-700 rotate-45" style={{ writingMode: 'vertical-lr' }}>{months[i].slice(0,3)}</span>
                <span className="text-xs text-gray-500">{count}</span>
              </div>
            ))}
          </div>
          {/* Tableau récapitulatif */}
          <table className="w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Mois</th>
                <th className="py-2 px-4 text-left">Nombre de réclamations</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((count, i) => (
                <tr key={i}>
                  <td className="py-2 px-4">{months[i]}</td>
                  <td className="py-2 px-4">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
} 