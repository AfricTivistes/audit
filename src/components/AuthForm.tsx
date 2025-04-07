"use client"

import type React from "react"

import { useState } from "react"

interface AuthFormProps {
  type: "login" | "register" | "reset"
}

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Validation simple
    if (!email) {
      setError("L'email est requis")
      setLoading(false)
      return
    }

    if ((type === "login" || type === "register") && !password) {
      setError("Le mot de passe est requis")
      setLoading(false)
      return
    }

    if (type === "register") {
      if (!name) {
        setError("Le nom est requis")
        setLoading(false)
        return
      }
      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas")
        setLoading(false)
        return
      }
    }

    // Simulation d'authentification
    setTimeout(() => {
      setLoading(false)

      if (type === "login") {
        if (email === "demo@africtivistes.org" && password === "password") {
          window.location.href = "/dashboard"
        } else {
          setError("Email ou mot de passe incorrect")
        }
      } else if (type === "register") {
        setSuccess("Compte créé avec succès! Vous pouvez maintenant vous connecter.")
        setTimeout(() => {
          window.location.href = "/login"
        }, 2000)
      } else if (type === "reset") {
        setSuccess("Instructions de réinitialisation envoyées à votre email.")
      }
    }, 1500)
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        {type === "login" ? "Connexion" : type === "register" ? "Inscription" : "Réinitialiser le mot de passe"}
      </h2>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

      {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === "register" && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {(type === "login" || type === "register") && (
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        {type === "register" && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading
              ? "Chargement..."
              : type === "login"
                ? "Se connecter"
                : type === "register"
                  ? "S'inscrire"
                  : "Envoyer les instructions"}
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          {type === "login" && (
            <>
              <div className="text-sm">
                <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Pas encore de compte?
                </a>
              </div>
              <div className="text-sm">
                <a href="/reset-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Mot de passe oublié?
                </a>
              </div>
            </>
          )}

          {type === "register" && (
            <div className="text-sm">
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Déjà un compte? Se connecter
              </a>
            </div>
          )}

          {type === "reset" && (
            <div className="text-sm">
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Retour à la connexion
              </a>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

