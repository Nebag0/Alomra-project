"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResetPassword() {
  const [email, setEmail] = useState("");

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 lg:px-8 py-12 bg-white text-gray-900">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl md:gap-40">
        {/* Logo */}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex-shrink-0 flex justify-center md:justify-end">
          <img
            alt="Alomra Logo"
            src="/alomra.svg"
            className="mx-auto h-40 md:h-48 w-auto"
          />
        </div>

        {/* Form */}
        <div className="mt-0 md:mt-0 sm:mx-auto sm:w-full sm:max-w-sm flex-shrink-0">
          <h2 className="my-7 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            J'ai oublié mon mot de passe
          </h2>
          <form action="#" method="POST" className="space-y-6">
            <div>
              <div className="flex items-end justify-between gap-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900"
                >
                  Adresse mail
                </label>
                <Link
                  href="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 text-sm transition"
                >
                  Se connecter
                </Link>
              </div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={!email}
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                  email
                    ? "bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 hover:from-indigo-700 hover:to-purple-600"
                    : "bg-gradient-to-r from-gray-300 to-gray-400 cursor-not-allowed opacity-70"
                }`}
              >
                Réinitialiser le mot de passe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}