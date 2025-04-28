"use client"

import { useState } from "react"
import { actions } from "astro:actions"

export default function AuthButton({ isLoggedIn, userEmail }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Fonction pour gérer le clic sur le bouton
  const handleAction = async () => {
    if (isLoggedIn) {
      // Si connecté : logique de déconnexion
      setIsLoggingOut(true)
      try {
        const results = await actions.signOut()
        if (!results.data?.success) {
          setIsLoggingOut(false)
          alert("Oops ! Impossible de se déconnecter. Veuillez réessayer.")
        } else {
          window.location.href = "/login" // Redirection vers login après déconnexion
        }
      } catch (error) {
        setIsLoggingOut(false)
        console.log(error)
        alert("Une erreur s'est produite. Veuillez réessayer.")
      }
    } else {
      // Si pas connecté : redirection vers /login
      window.location.href = "/login"
    }
  }

  // Texte et couleur du bouton en fonction de l'état
  const buttonText = isLoggedIn ? (isLoggingOut ? "Déconnexion..." : "Déconnexion") : "Connexion"
  const buttonColor = isLoggedIn ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"

  return (
    <button
      onClick={handleAction}
      disabled={isLoggingOut}
      className={`ml-4 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white ${buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
      title={isLoggedIn ? `Connecté en tant que ${userEmail}` : "Se connecter"}
    >
      {isLoggedIn && !isLoggingOut && userEmail ? (
        <span className="flex items-center">
          <span className="mr-2 h-2 w-2 rounded-full bg-green-400"></span>
          {buttonText}
        </span>
      ) : (
        buttonText
      )}
    </button>
  )
}