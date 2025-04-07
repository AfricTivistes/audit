"use client"

import { useState } from "react"

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = () => {
    setIsLoggingOut(true)
    // Simuler une déconnexion
    setTimeout(() => {
      window.location.href = "/login"
    }, 1000)
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="ml-4 px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      {isLoggingOut ? "Déconnexion..." : "Déconnexion"}
    </button>
  )
}

