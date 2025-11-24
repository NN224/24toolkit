"use client"

import { useState } from "react"
import PageLayout from "@/components/page-layout"
import Breadcrumbs from "@/components/breadcrumbs"

interface Question {
  id: number
  text: string
  options: { value: string; label: string }[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "What category are you interested in?",
    options: [
      { value: "streaming", label: "Streaming Services" },
      { value: "tech", label: "Technology" },
      { value: "travel", label: "Travel & Accommodation" },
      { value: "lifestyle", label: "Lifestyle & Health" },
    ],
  },
  {
    id: 2,
    text: "What is your budget range?",
    options: [
      { value: "low", label: "Budget-friendly (Under $50/month)" },
      { value: "medium", label: "Mid-range ($50-$150/month)" },
      { value: "high", label: "Premium ($150+/month)" },
      { value: "flexible", label: "Flexible budget" },
    ],
  },
  {
    id: 3,
    text: "What matters most to you?",
    options: [
      { value: "quality", label: "Quality & Features" },
      { value: "price", label: "Best Price" },
      { value: "convenience", label: "Convenience & Ease of Use" },
      { value: "variety", label: "Variety & Options" },
    ],
  },
  {
    id: 4,
    text: "How often will you use it?",
    options: [
      { value: "daily", label: "Daily" },
      { value: "weekly", label: "Weekly" },
      { value: "monthly", label: "Monthly" },
      { value: "occasionally", label: "Occasionally" },
    ],
  },
  {
    id: 5,
    text: "Do you prefer established brands or new alternatives?",
    options: [
      { value: "established", label: "Established & Trusted Brands" },
      { value: "new", label: "New & Innovative Options" },
      { value: "either", label: "Either works for me" },
    ],
  },
]

const recommendations: Record<string, { title: string; description: string; link: string }> = {
  streaming: {
    title: "Netflix",
    description:
      "Based on your preferences, Netflix offers the best balance of quality content, user experience, and value for money.",
    link: "/comparison/netflix-vs-disney",
  },
  tech: {
    title: "iPhone",
    description:
      "For your needs, iPhone provides the best ecosystem, quality, and long-term value in the smartphone market.",
    link: "/comparison/iphone-vs-samsung",
  },
  travel: {
    title: "Airbnb",
    description: "Airbnb matches your preferences with unique accommodations, local experiences, and flexible options.",
    link: "/comparison/airbnb-vs-hotels",
  },
  lifestyle: {
    title: "Gym Membership",
    description: "A gym membership suits your lifestyle with professional equipment, classes, and community support.",
    link: "/comparison/gym-vs-home-workouts",
  },
}

export default function QuickDecisionClient() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState<{ title: string; description: string; link: string } | null>(null)

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value)
  }

  const handleNext = () => {
    if (!selectedOption) return

    const newAnswers = { ...answers, [questions[currentQuestion].id]: selectedOption }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption("")
    } else {
      const category = newAnswers[1]
      const recommendation = recommendations[category] || recommendations.streaming
      setResult(recommendation)
      setShowResult(true)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedOption(answers[questions[currentQuestion - 1].id] || "")
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setSelectedOption("")
    setShowResult(false)
    setResult(null)
  }

  const handleCategorySelect = (category: string) => {
    setAnswers({ 1: category })
    setCurrentQuestion(1)
    setSelectedOption("")
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <PageLayout currentPath="/quick-decision">
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Quick Decision Tool", href: "/quick-decision" },
      ]} />
      
      <section className="hero-section">
        <div className="container">
          <h1>Quick Decision Tool</h1>
          <p className="hero-subtitle">Answer 5 quick questions and get your perfect recommendation in 60 seconds!</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto" style={{ marginTop: "2rem" }}>
        {!showResult ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center">{questions[currentQuestion].text}</h2>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedOption === option.value
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className="px-6 py-3 bg-black text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800"
              >
                {currentQuestion === questions.length - 1 ? "Get Result" : "Next →"}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">✓</div>
            <h2 className="text-3xl font-bold mb-4">Your Perfect Match!</h2>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-bold mb-3">{result?.title}</h3>
              <p className="text-gray-700">{result?.description}</p>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href={result?.link}
                className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800"
              >
                Read Full Comparison →
              </a>
              <button
                onClick={handleRestart}
                className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
              >
                ↻ Take Quiz Again
              </button>
            </div>
          </div>
        )}

        {currentQuestion === 0 && !showResult && (
          <div className="mt-12">
            <h3 className="text-xl font-bold text-center mb-6">Or choose a category:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: "streaming", label: "Streaming", icon: "📺" },
                { value: "tech", label: "Technology", icon: "💻" },
                { value: "travel", label: "Travel", icon: "✈️" },
                { value: "lifestyle", label: "Lifestyle", icon: "🏃" },
              ].map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategorySelect(cat.value)}
                  className="p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-black transition-all text-center"
                >
                  <div className="text-4xl mb-2">{cat.icon}</div>
                  <div className="font-semibold">{cat.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
