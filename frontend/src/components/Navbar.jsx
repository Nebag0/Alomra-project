"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo et titre */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8"
                src="/alomra.svg"
                alt="Alomra Logo"
              />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold">Alomra</h1>
            </div>
          </div>

          {/* Navigation links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
              >
                Tableau de bord
              </button>
              <button
                onClick={() => router.push("/admin/users")}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
              >
                Utilisateurs
              </button>
              <button
                onClick={() => router.push("/admin/reclamations")}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition"
              >
                Réclamations
              </button>
            </div>
          </div>

          {/* User menu */}
          <div className="relative">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium">
                {currentUser.nom} {currentUser.prenom}
              </span>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-400 flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {currentUser.nom?.charAt(0) || "U"}
                    </span>
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          router.push("/profil");
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Mon profil
                      </button>
                      <button
                        onClick={() => {
                          router.push("/profil/motdepasse");
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Changer mot de passe
                      </button>
                      <hr className="my-1" />
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition"
          >
            Tableau de bord
          </button>
          <button
            onClick={() => router.push("/admin/users")}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition"
          >
            Utilisateurs
          </button>
          <button
            onClick={() => router.push("/admin/reclamations")}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition"
          >
            Réclamations
          </button>
        </div>
      </div>
    </nav>
  );
}