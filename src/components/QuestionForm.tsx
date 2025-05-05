import { useState, useEffect } from "react";
import ProgressBar from "./ProgressBar";
import { actions } from "astro:actions";

interface Question {
  id: string;
  text: string;
  type: "text" | "radio" | "checkbox" | "select";
  options?: string[];
  required?: boolean;
}

interface QuestionFormProps {
  questions: Question[];
  auditId: string;
  initialAnswers?: Record<string, any>;
  onComplete: (answers: Record<string, any>) => void;
}

export default function QuestionForm({ questions, auditId, initialAnswers = {}, onComplete }: QuestionFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, any>>(initialAnswers);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    console.log('Initial answers reçus dans QuestionForm:', initialAnswers);
    setAnswers(initialAnswers);
  }, [initialAnswers]);

  if (!questions || questions.length === 0 || currentStep < 1 || currentStep > questions.length) {
     console.error("Invalid questions array or currentStep:", { questions, currentStep });
     return <div className="p-6 text-center text-gray-600">Chargement des questions ou état invalide...</div>;
  }

  const currentQuestion = questions[currentStep - 1];

  // Additional check just in case, although the above check should cover most cases
  if (!currentQuestion) {
      console.error("Current question is undefined for step:", currentStep);
      return <div className="p-6 text-center text-red-600">Erreur : Impossible de charger la question actuelle.</div>;
  }

  const handleNext = async () => {
    if (currentQuestion && currentQuestion.required && !answers[currentQuestion.id]) {
      setError("Cette question est obligatoire");
      return;
    }

    setError("");
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - attempt to save before calling onComplete
      console.log('Dernière étape atteinte. Tentative de sauvegarde finale des réponses:', answers);
      const { data, error: saveError } = await actions.audit.saveResponses({ auditId, answers });

      if (saveError) {
        setSaveMessage(`Erreur lors de la sauvegarde finale: ${saveError.message}`);
        // Optionally, prevent completion if save fails:
        // return;
      } else if (data?.success) {
        setSaveMessage(data.message || "Réponses finales sauvegardées avec succès.");
        // Optionally clear the message after a delay
        // setTimeout(() => setSaveMessage(""), 3000);
        onComplete(answers); // Call onComplete only after successful save
      } else {
        // Handle cases where data exists but success is not explicitly true, if applicable
         setSaveMessage("La sauvegarde s'est terminée, mais le succès n'a pas été confirmé.");
         onComplete(answers); // Decide if onComplete should be called here
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    console.log('Sauvegarde des réponses:', answers);
    const { data, error: saveError } = await actions.audit.saveResponses({ auditId, answers }); // Renamed 'error' to 'saveError' to avoid conflict
    if (saveError) {
      setSaveMessage(`Erreur: ${saveError.message}`);
    } else if (data?.success) {
      setSaveMessage(data.message);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleChange = (value: any) => {
    // Check if currentQuestion exists before accessing its properties
    if (!currentQuestion) return; // Should not happen if checks above are in place
    console.log('Mise à jour de la réponse pour question ID:', currentQuestion.id, 'Valeur:', value);
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
    setError("");
  };

  const renderQuestionInput = () => {
    if (!currentQuestion) return null;

    console.log('Rendu de la question ID:', currentQuestion.id, 'Réponse actuelle:', answers[currentQuestion.id]);
    switch (currentQuestion.type) {
      case "text":
        return (
          <textarea
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
        );
      case "radio":
        return (
          <div className="mt-4 space-y-4">
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={option}
                  name={currentQuestion.id}
                  type="radio"
                  checked={answers[currentQuestion.id] === option}
                  onChange={() => handleChange(option)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={option} className="ml-3 block text-sm font-medium text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="mt-4 space-y-4">
            {currentQuestion.options?.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={option}
                  name={option}
                  type="checkbox"
                  checked={(answers[currentQuestion.id] || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = answers[currentQuestion.id] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((value: string) => value !== option);
                    handleChange(newValues);
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={option} className="ml-3 block text-sm font-medium text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case "select":
        return (
          <select
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Sélectionnez une option</option>
            {currentQuestion.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <ProgressBar currentStep={currentStep} totalSteps={questions.length} />

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900">{currentQuestion.text}</h3>

        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        {saveMessage && (
          <div className={`mt-2 text-sm ${saveMessage.startsWith('Erreur') ? 'text-red-600' : 'text-green-600'}`}>
            {saveMessage}
          </div>
        )}

        <div className="mt-4">{renderQuestionInput()}</div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Précédent
          </button>

          <button
            type="button"
            onClick={handleSave} // Keep manual save button
            className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sauvegarder
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {currentStep === questions.length ? "Terminer" : "Suivant"}
          </button>
        </div>
      </div>
    </div>
  );
}
