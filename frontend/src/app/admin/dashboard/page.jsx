"use client";
import Sidebar from "@/components/Sidebar";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isConnected={true} handleLogout={() => {}} role="admin" />
      <main className="flex-1 md:ml-60 w-full pt-16 md:pt-0 px-4 md:px-12 py-8">
        <h1 className="text-3xl font-bold text-indigo-900">Bienvenue sur le Dashboard Admin</h1>
        {/* Ajoute ici des stats, graphiques, etc. */}
      </main>
    </div>
  );
}