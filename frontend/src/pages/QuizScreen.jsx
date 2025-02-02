import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../lib/axios"
import LoadingSpinner from "../components/LoadingSpinner"
import { motion } from "framer-motion"
import { useTheme } from "../context/ThemeContext"
import { useDispatch, useSelector } from "react-redux"
import { fetchQuizStats } from "../Slicers/quizStatsSlice"

export default function QuizScreen() {
  const { theme } = useTheme()
  const { categoryId, difficulty } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const dispatch = useDispatch()
  const quizStats = useSelector((state) => state.quizStats)

  useEffect(() => {
    // Fetch quiz stats when component mounts
    dispatch(fetchQuizStats())
    
    const fetchQuestions = async () => {
      try {
        const response = await api.get("/quizzes", {
          params: {
            category: categoryId,
            difficulty,
            limit: 10,
          },
        })

        if (!response.data || response.data.length === 0) {
          throw new Error("No questions found")
        }

        const processedQuestions = response.data
          .map((question) => {
            try {
              // Extract answers and remove null values
              const answers = Object.entries(question.answers || {})
                .filter(([_, value]) => value !== null)
                .reduce((acc, [key, value]) => {
                  acc[key] = value
                  return acc
                }, {})

              // Create array of answer objects
              const answersList = Object.entries(answers).map(([key, text]) => ({
                id: key,
                text,
                isCorrect: question.correctAnswers?.includes(key),
              }))

              return {
                id: question.id,
                question: question.question,
                answers: shuffle([...answersList]),
                multiple_correct_answers: question.multipleCorrectAnswers || false,
                explanation: question.explanation,
                correct_count: question.correctAnswers?.length || 1,
              }
            } catch (err) {
              console.error("Error processing question:", err)
              return null
            }
          })
          .filter((q) => q !== null)

        if (processedQuestions.length === 0) {
          throw new Error("No valid questions found after processing")
        }

        setQuestions(processedQuestions)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load questions:", error)
        const errorMessage =
          error.response?.data?.error ||
          (error.response?.status === 429 ? "Too many requests. Please try again later." : "Failed to load questions")
        setError(errorMessage)
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [categoryId, difficulty, dispatch])

  useEffect(() => {
    if (!loading && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit()
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [loading, timeLeft])

  const handleAnswerSelect = (answerId) => {
    const question = questions[currentQuestion]

    if (question.multiple_correct_answers) {
      setSelectedAnswers((prev) => {
        if (prev.includes(answerId)) {
          return prev.filter((id) => id !== answerId)
        } else {
          return [...prev, answerId]
        }
      })
    } else {
      setSelectedAnswers([answerId])
    }
  }

  const handleSubmit = () => {
    const question = questions[currentQuestion]
    let isCorrect = false

    if (question.multiple_correct_answers) {
      const correctAnswers = question.answers.filter((answer) => answer.isCorrect).map((answer) => answer.id)

      isCorrect =
        selectedAnswers.length === correctAnswers.length &&
        selectedAnswers.every((id) => correctAnswers.includes(id)) &&
        correctAnswers.every((id) => selectedAnswers.includes(id))
    } else {
      isCorrect =
        selectedAnswers.length === 1 &&
        question.answers.some((answer) => answer.id === selectedAnswers[0] && answer.isCorrect)
    }

    console.log(`Question ${currentQuestion + 1}:`, {
      questionId: question.id,
      selectedAnswers,
      correctAnswers: question.answers.filter((a) => a.isCorrect).map((a) => a.id),
      isCorrect,
    })

    const nextQuestion = currentQuestion + 1
    const newScore = isCorrect ? score + 1 : score

    setScore(newScore)
    setSelectedAnswers([])

    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
      setTimeLeft(20)
    } else {
      handleQuizComplete(newScore, questions.length)
    }
  }

  const handleQuizComplete = (correct, total) => {
    navigate('/results', {
      state: {
        correctAnswers: correct,
        totalQuestions: total
      }
    })
  }

  const shuffle = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  if (loading) return <LoadingSpinner className="text-primary" />

  if (error)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-surface/90 rounded-xl shadow-xl overflow-hidden w-full max-w-md p-8 text-center"
        >
          <div className="text-primary mb-4">{error}</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary rounded-lg hover:bg-accent transition-colors duration-300"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    )

  const currentQuestionData = questions[currentQuestion]

  return (
    <div className={`${theme === "dark" ? "dark" : ""}`}>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-surface rounded-xl shadow-xl overflow-hidden w-full max-w-2xl border-2 border-color"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="text-primary text-lg font-semibold">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center border-2 border-color">
                <p className="text-2xl font-bold text-primary">{timeLeft}s</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-primary mb-6">{currentQuestionData.question}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {currentQuestionData.answers.map((answer) => (
                <motion.button
                  key={answer.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAnswerSelect(answer.id)}
                  className={`p-4 rounded-lg text-left transition-colors border-2
                  ${
                    selectedAnswers.includes(answer.id)
                      ? "bg-secondary border-color text-primary"
                      : "bg-background border-color text-primary hover:bg-primary"
                  }`}
                  disabled={timeLeft <= 0}
                >
                  {answer.text}
                </motion.button>
              ))}
            </div>

            {currentQuestionData.multiple_correct_answers && (
              <p className="text-secondary text-sm mb-4">Select {currentQuestionData.correct_count} correct answers</p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={selectedAnswers.length === 0 || timeLeft <= 0}
              className="w-full bg-secondary text-primary py-3 rounded-lg hover:bg-accent 
                      transition-colors duration-300 disabled:bg-background disabled:cursor-not-allowed
                      border-2 border-color font-semibold"
            >
              Submit Answer
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

