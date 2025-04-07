interface SecurityScoreCardProps {
  score: number
  category: string
  recommendations: string[]
}

export default function SecurityScoreCard({ score, category, recommendations }: SecurityScoreCardProps) {
  const getScoreColor = () => {
    if (score >= 70) return "text-green-600"
    if (score >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBackgroundColor = () => {
    if (score >= 70) return "bg-green-100"
    if (score >= 40) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{category}</h3>
          <div
            className={`${getScoreBackgroundColor()} ${getScoreColor()} text-2xl font-bold rounded-full w-14 h-14 flex items-center justify-center`}
          >
            {score}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Recommandations:</h4>
          <ul className="mt-2 space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

