"use client"

import { useState } from "react"
import ProgressBar from "./ProgressBar"

interface Question {
  id: string
  text: string
  type: "text" | "radio" | "checkbox" | "select"
  options?: string[]
  required?: boolean
}

interface QuestionFormProps {
  questions: Question[]
  onComplete: (answers: Record<string, any>) => void
  onSave?: (answers: Record<string, any>) => void
}

export default function QuestionForm({ questions, onComplete, onSave }: QuestionFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [error, setError] = useState("")

  const currentQuestion = questions[currentStep - 1]

  const handleNext = () => {
    // Validation
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      setError("Cette question est obligatoire")
      return
    }

    setError("")

    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(answers)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave(answers)
    }
  }

  const handleChange = (value: any) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    })
    setError("")
  }

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case "text":
        return (
          <textarea
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleChange(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={4}
          />
        )

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
        )

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
                    const currentValues = answers[currentQuestion.id] || []
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((value: string) => value !== option)
                    handleChange(newValues)
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={option} className="ml-3 block text-sm font-medium text-gray-700">
                  {option}
                </label>
              </div>
            ))}
          </div>
        )

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
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <ProgressBar currentStep={currentStep} totalSteps={questions.length} />

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900">{currentQuestion.text}</h3>

        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

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
            onClick={handleSave}
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
  )
}

