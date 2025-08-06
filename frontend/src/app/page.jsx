"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AtSign , ChartNoAxesCombined, UserCog, Users, ClipboardCheck } from "lucide-react";

export default function Home() {
  const [redirectUrl, setRedirectUrl] = useState("/login");
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Vérifier la présence d'un token
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === "admin") {
          setRedirectUrl("/admin/dashboard");
          setIsAuth(true);
        } else if (payload.role === "superviseur") {
          setRedirectUrl("/superviseur");
          setIsAuth(true);
        }
      } catch {
        setIsAuth(false);
        setRedirectUrl("/login");
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="py-16 px-4 bg-gradient-to-b from-blue-900 to-blue-500 text-white">
          <div className="container mx-auto text-center">
            <Image 
              src="/alomra.svg" 
              alt="Accueil" 
              width={200} 
              height={150} 
              className="mx-auto mb-6"
              priority  
            />          
            <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">Gestion centralisée des sanctions disciplinaires </h1>
            
            <div className="flex justify-center">
              <Link href={redirectUrl} passHref>
                <button
                  className="px-8 py-3 rounded-lg bg-white text-blue-800 font-bold text-lg border border-blue-200 shadow-md transition-all duration-200 hover:bg-blue-50 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {isAuth ? "Accéder à la plateforme" : "Se connecter à la plateforme"}
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section id="fonctionnalites" className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-blue-800">Fonctionnalités principales</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100 hover:shadow-xl transition-shadow duration-200">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4 mx-auto">
                  <Users className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-800 text-center">Pour les Superviseurs</h3>
                <p className="text-gray-600 mb-2 text-center">
                  Demander l'application des sanctions disciplinaires envers les agents pour les differents motifs: retards, abandon de poste, etc.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100 hover:shadow-xl transition-shadow duration-200">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4 mx-auto">
                  <UserCog className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-800 text-center">Pour les Admins</h3>
                <h4 className="text-l font-bold mb-3 text-blue-800 text-center">(RH & DOP)</h4>
                <p className="text-gray-600 mb-2 text-center">
                   Rédiger les sanctions demandees à infliger aux agents ayant fait l’objet de mesures disciplinaires.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100 hover:shadow-xl transition-shadow duration-200">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4 mx-auto">
                  <ChartNoAxesCombined className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-800 text-center">Suivi & Statistiques</h3>
                <p className="text-gray-600 mb-2 text-center">
                  Assurer un suivi et avoir des statistiques des sanctions disciplinaires par mois ou/et par année.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md border border-blue-100 hover:shadow-xl transition-shadow duration-200">
                <div className="bg-blue-100 p-3 rounded-full w-fit mb-4 mx-auto">
                  <AtSign className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-blue-800 text-center">Notification par email</h3>
                <p className="text-gray-600 mb-2 text-center">
                  Choisir les personnes à notifier après l'ajout d'une nouvelle demande de sanctions disciplinaires.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-blue-900 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <ClipboardCheck className="h-6 w-6" />
              <span className="text-xl font-bold">Alomra - Plaintes</span>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="hover:underline hover:text-blue-200 transition-colors">À propos</Link>
              <Link href="#" className="hover:underline hover:text-blue-200 transition-colors">Contact</Link>
              <Link href="#" className="hover:underline hover:text-blue-200 transition-colors">Confidentialité</Link>
              <Link href="#" className="hover:underline hover:text-blue-200 transition-colors">Conditions</Link>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left text-blue-200">
            &copy; {new Date().getFullYear()} Alomra. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  )
}
