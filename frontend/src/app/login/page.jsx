"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 lg:px-8 py-12 bg-white text-gray-900">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl md:gap-40">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm flex-shrink-0 flex justify-center md:justify-end ">
          <img
            alt="Alomra Logo"
            src="alomra.svg"
            className="mx-auto h-40 md:h-100 w-auto"
          />
        </div>

        {/* Form */}
        <div className="mt-0 md:mt-0 sm:mx-auto sm:w-full sm:max-w-sm flex-shrink-0">
          <h2 className="my-7 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Connectez-vous à votre compte
          </h2>
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Addresse mail
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Mot de passe
                </label>
                <div className="text-sm">
                  <a
                    href="/login/reset"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Mot de passe oublié?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!email || !password}
                className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
    ${
      email && password
        ? "bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-500 hover:from-indigo-700 hover:to-purple-600"
        : "bg-gradient-to-r from-gray-300 to-gray-400 cursor-not-allowed opacity-70"
    }`}
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}