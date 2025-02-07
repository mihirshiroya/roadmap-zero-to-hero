import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { updateQuizStats } from "../Slicers/quizStatsSlice"

export default function QuizResults() {
  const location = useLocation()
  const { correctAnswers, totalQuestions } = location.state || {}
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(state => state.auth?.token)
  const hasUpdated = useRef(false)

  useEffect(() => {
    if (!hasUpdated.current && correctAnswers !== undefined && totalQuestions !== undefined) {
      hasUpdated.current = true
      dispatch(updateQuizStats({ correctAnswers, totalQuestions }))
        .unwrap()
        .catch(console.error)
    }
  }, [correctAnswers, totalQuestions, dispatch])

  useEffect(() => {
    if (!correctAnswers && !totalQuestions) {
      navigate("/quizzes", { replace: true })
    }
  }, [correctAnswers, totalQuestions, navigate])

  if (!correctAnswers && !totalQuestions)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl">Loading results...</div>
      </div>
    )

  const percentage = ((correctAnswers / totalQuestions) * 100 || 0).toFixed(1)
  const getGradeColor = () => {
    if (percentage >= 80) return "text-green-500"
    if (percentage >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-2 border-gray-200 rounded-xl p-8 max-w-md w-full shadow-xl"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Quiz Results</h1>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
          className="text-6xl font-bold mb-4"
        >
          <span className={getGradeColor()}>{correctAnswers}</span>
          <span className="text-primary">/{totalQuestions}</span>
        </motion.div>
        <p className="text-gray-400 text-xl mb-8">{percentage}% Correct</p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mb-8">
          {percentage >= 70 ? (
            <p className="text-green-600 font-semibold">Great job! You've mastered this quiz!</p>
          ) : percentage >= 50 ? (
            <p className="text-yellow-600 font-semibold">Good effort! Keep practicing to improve.</p>
          ) : (
            <p className="text-red-600 font-semibold">Don't give up! Try again to boost your score.</p>
          )}
        </motion.div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            navigate("/quizzes");
          }}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold w-full"
        >
          Try Another Quiz
        </motion.button>
      </motion.div>
    </div>
  )
}

