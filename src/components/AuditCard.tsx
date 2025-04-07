"use client"

interface AuditCardProps {
  title: string
  description: string
  icon: string
  status?: "available" | "completed" | "in-progress"
  completionDate?: string
  score?: number
  onClick: () => void
}

export default function AuditCard({
  title,
  description,
  icon,
  status = "available",
  completionDate,
  score,
  onClick,
}: AuditCardProps) {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 text-xl">{icon}</span>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>

            {status === "completed" && (
              <div className="mt-2">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">Complété le {completionDate}</span>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        score && score >= 70 ? "bg-green-600" : score && score >= 40 ? "bg-yellow-500" : "bg-red-600"
                      }`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{score}/100</span>
                </div>
              </div>
            )}

            {status === "in-progress" && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  En cours
                </span>
              </div>
            )}

            <div className="mt-4">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  status === "completed"
                    ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                    : "text-white bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {status === "completed" ? "Voir le rapport" : status === "in-progress" ? "Continuer" : "Démarrer"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

