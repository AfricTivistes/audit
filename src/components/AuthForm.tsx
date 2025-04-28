import { actions } from "astro:actions";
import type React from "react";
import { useState } from "react";

interface AuthFormProps {
  type: "login" | "register" | "reset";
}

export default function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation simple
    if (!email) {
      setError("L'email est requis");
      setLoading(false);
      return;
    }

    if ((type === "login" || type === "register") && !password) {
      setError("Le mot de passe est requis");
      setLoading(false);
      return;
    }

    if (type === "register") {
      if (!name) {
        setError("Le nom est requis");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        setLoading(false);
        return;
      }
      
      try {
        // Use FormData for Astro Actions
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("name", name);

        const results = await actions.signUp(formData);

        if (!results.data?.success) {
          setError(results.data?.message || "Échec de l'inscription");
        } else {
          setSuccess(results.data?.message || "Compte créé avec succès! Vous pouvez maintenant vous connecter.");
          // Redirection après délai pour permettre à l'utilisateur de voir le message de succès
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        }
      } catch (err) {
        console.error(err);
        setError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }

    } else if (type === "login") {
       try {
         // Use FormData for Astro Actions
         const formData = new FormData();
         formData.append("email", email);
         formData.append("password", password);

         const results = await actions.signIn(formData);

         if (!results.data?.success) {
           setError(results.data?.message || "Échec de la connexion");
         } else {
           // Redirect on successful login
           window.location.href = "/dashboard";
           // No need to set success message if redirecting immediately
         }
       } catch (err) {
         console.error(err);
         setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
       } finally {
         setLoading(false);
       }

    } else if (type === "reset") {
      // TODO: Implement Reset Password logic using Astro Actions if available
      console.log("Reset Password attempt (not implemented with actions yet)");
      // Placeholder for reset logic
       setTimeout(() => {
         setLoading(false);
         setSuccess("Instructions de réinitialisation envoyées à votre email.");
       }, 1500);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        {type === "login" ? "Connexion" : type === "register" ? "Inscription" : "Réinitialiser le mot de passe"}
      </h2>

      {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>}

      <form onSubmit={handleSubmit} id={type === 'login' ? "signin-form" : undefined} className="space-y-4">
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
              required={type === 'register'}
            />
          </div>
        )}

        <div>
          {/* Use specific labels for login */}
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            {type === 'login' ? "Entrez votre email" : "Email"}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={type === 'login' ? "Votre email@exemple.com" : undefined}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${type === 'login' ? 'border-gray-500' : 'border-gray-300'}`} // Apply specific style for login
            required
          />
        </div>

        {(type === "login" || type === "register") && (
          <div>
             {/* Use specific labels for login */}
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
               {type === 'login' ? "Entrez votre mot de passe" : "Mot de passe"}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder={type === 'login' ? "Votre mot de passe" : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${type === 'login' ? 'border-gray-500' : 'border-gray-300'}`} // Apply specific style for login
              required
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
              required={type === 'register'}
            />
          </div>
        )}

        <div>
           {/* Adapt button style and text for login */}
          <button
            type="submit"
            id={type === 'login' ? "sign-in" : undefined}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading
              ? (type === 'login' ? "Connexion en cours..." : "Chargement...")
              : type === "login"
                ? "Se connecter"
                : type === "register"
                  ? "S'inscrire"
                  : "Envoyer les instructions"}
          </button>
        </div>

         {/* Keep existing navigation links */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
          {type === "login" && (
            <>
              <div className="text-sm w-full sm:w-auto text-center sm:text-left">
                <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Pas encore de compte?
                </a>
              </div>
              <div className="text-sm w-full sm:w-auto text-center sm:text-right">
                <a href="/reset-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Mot de passe oublié?
                </a>
              </div>
            </>
          )}

          {type === "register" && (
            <div className="text-sm w-full text-center">
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Déjà un compte? Se connecter
              </a>
            </div>
          )}

          {type === "reset" && (
            <div className="text-sm w-full text-center">
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Retour à la connexion
              </a>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}