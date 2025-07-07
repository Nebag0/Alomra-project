import { useState } from "react";
import Link from "next/link";
import { ChartLine, BookText,ClipboardCheck, UserRoundCog, LogOut, CircleUserRound } from "lucide-react";

const LINKS = {
  admin: [
    { href: "/admin/dashboard", icon: <ChartLine className="h-8 w-8 text-white-700" />, label: "Dashboard" },
    { href: "/admin/reclamations", icon: <ClipboardCheck className="h-8 w-8 text-white-700" />, label: "Réclamations" },
    { href: "/admin/users", icon: <UserRoundCog className="h-8 w-8 text-white-700" />, label: "Utilisateurs" },
    { href: "/profil", icon: <CircleUserRound className="h-8 w-8 text-white-700" />, label: "Profil" },
  ],
  superviseur: [
    { href: "/superviseur", icon: <BookText className="h-8 w-8 text-white-700" />, label: "Mes réclamations" },
    { href: "/profil", icon: <CircleUserRound className="h-8 w-8 text-white-700" />, label: "Profil" },
    // Ajoute d'autres liens superviseur ici
  ]
};

export default function Sidebar({ isConnected, handleLogout, role = "admin" }) {
  const [open, setOpen] = useState(false);
  const links = LINKS[role] || [];

  return (
    <>
      {/* Sidebar desktop */}
      <nav className="hidden md:flex flex-col w-60 bg-gradient-to-b from-indigo-700 to-indigo-900 text-white py-8 px-4 shadow-lg fixed h-full z-20">
        <div className="flex items-center gap-2 mb-10">
          <img src="/alomra.svg" alt="Logo" className="h-10 w-10" />
          <span className="text-xl font-bold tracking-wide">Alomra</span>
        </div>
        <ul className="flex flex-col gap-4 flex-1">
          {links.map(link => (
            <li key={link.href}>
              <Link href={link.href} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-800 transition">
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {isConnected && (
          <button
            onClick={handleLogout}
            className="mt-8 flex items-center justify-center bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded text-white font-semibold"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Se déconnecter
          </button>
        )}
      </nav>

      {/* Topbar mobile */}
      <nav className="md:hidden flex items-center justify-between w-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white px-4 py-3 shadow-lg fixed top-0 left-0 z-30">
        <div className="flex items-center gap-2">
          <img src="/alomra.svg" alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-bold">Alomra</span>
        </div>
        <button
          className="focus:outline-none"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
        >
          {/* Hamburger icon */}
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </nav>

      {/* Sidebar mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 flex">
          {/* Fond semi-transparent */}
          <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm transition" onClick={() => setOpen(false)} />
          <div className="relative bg-gradient-to-b from-indigo-700 to-indigo-900 text-white w-60 h-full shadow-lg p-8 z-50 animate-fade-in flex flex-col">
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
            >
              &times;
            </button>
            <ul className="flex flex-col gap-4 mt-10">
              {links.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-indigo-800 transition" onClick={() => setOpen(false)}>
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {isConnected && (
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="mt-8 flex items-center justify-center bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded text-white font-semibold"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Se déconnecter
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}