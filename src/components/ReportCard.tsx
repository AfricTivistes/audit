"use client"

interface ReportCardProps {
  title: string
  date: string
  score: number
  recommendations: string[]
  onView: () => void
  onDownload: () => void
}

export default function ReportCard({ title, date, score, recommendations, onView, onDownload }: ReportCardProps) {
  const scoreColor = score >= 70 ? "text-green-600" : score >= 40 ? "text-yellow-600" : "text-red-600"

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">Généré le {date}</p>

        <div className="mt-4 flex items-center">
          <div className={`text-3xl font-bold ${scoreColor}`}>{score}</div>
          <div className="ml-2 text-sm text-gray-500">/100</div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Principales recommandations:</h4>
          <ul className="mt-2 space-y-1">
            {recommendations.slice(0, 3).map((rec, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {rec}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            onClick={onView}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Voir le rapport
          </button>
          <button
            onClick={onDownload}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Télécharger PDF
          </button>
        </div>
      </div>
    </div>
  )
}

