import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchRoadmapById, updateCheckpointProgress } from "../Slicers/roadmapSlice"
import Progress from "../ui/Progress"
import Button from "../ui/Button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/Dialog"
import Collapse from "../ui/Collapse"
import { CheckCircle, Circle, ChevronDown, ChevronUp, Lock, Clock, Info } from "lucide-react"
import LoadingSpinner from "../components/LoadingSpinner"
import { cn } from "../lib/utils"
import  Checkbox  from "../ui/Checkbox"
import { useTheme } from "../context/ThemeContext"

import axios from '../lib/axios'

const RoadmapDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentRoadmap: roadmap, loading, error } = useSelector((state) => state.roadmaps)
  const { theme } = useTheme()
  const [expandedSteps, setExpandedSteps] = useState(() => {
    const initial = new Set();
    if (roadmap?.steps?.length > 0) {
      initial.add(roadmap.steps[0].id);
    }
    return initial;
  });

  useEffect(() => {
    dispatch(fetchRoadmapById(id))
  }, [dispatch, id])

  useEffect(() => {
    if (roadmap?.steps?.length > 0 && expandedSteps.size === 0) {
      setExpandedSteps(new Set([roadmap.steps[0].id]))
    }
  }, [roadmap, expandedSteps])

  const handleCheckpointToggle = async (e, stepId, checkpointId) => {
    e.stopPropagation()
    
    // Prevent interaction if checkpoint is already completed
    if (isCheckpointCompleted(stepId, checkpointId)) return
    
    try {
      dispatch(updateCheckpointProgress({
        roadmapId: id,
        stepId,
        checkpointId,
        completed: true
      })).unwrap()

      // Automatically expand the step after completion
      setExpandedSteps(prev => new Set(prev).add(stepId))
      
    } catch (error) {
      console.error("Failed to update checkpoint:", error)
    }
  }

  const isCheckpointCompleted = (stepId, checkpointId) => {
    return (
      roadmap?.progress?.completedCheckpoints?.some(
        (cp) => cp.stepId === stepId && cp.checkpointId === checkpointId
      ) || false
    )
  }

  const isStepLocked = (stepIndex) => {
    if (stepIndex === 0) return false
    const previousStep = roadmap.steps[stepIndex - 1]
    return !previousStep.checkpoints.every((cp) => isCheckpointCompleted(previousStep.id, cp.id))
  }

  const toggleStep = (e, stepId) => {
    e.stopPropagation()
    setExpandedSteps((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(stepId)) {
        newSet.delete(stepId)
      } else {
        newSet.add(stepId)
      }
      return newSet
    })
  }

  const getStepProgress = (stepId) => {
    const total = roadmap.steps.find((s) => s.id === stepId).checkpoints.length
    const completed =
      roadmap.progress?.completedCheckpoints?.filter((cp) => cp.stepId === stepId).length || 0
    return { completed, total }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-red-500">{error}</div>
  if (!roadmap) return null

  const allCompleted = roadmap.steps.every((step) =>
    step.checkpoints.every((cp) => isCheckpointCompleted(step.id, cp.id))
  )

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Updated Header Section */}
      <div className="bg-background border-b border-color shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <img
              src={roadmap.logo_url || "/placeholder.svg"}
              alt={roadmap.name}
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
            <div className="flex-grow">
              <h1 className="text-2xl md:text-3xl font-bold text-primary">{roadmap.name}</h1>
              <p className="text-secondary text-sm md:text-base">Track your progress through the learning journey</p>
              <div className="mt-2 max-w-md">
                <Progress
                  value={roadmap.progress?.percentage || 0}
                  className="h-2 bg-surface"
                  indicatorClassName="bg-primary"
                />
                <p className="text-sm text-secondary mt-1">
                  {roadmap.progress?.completedCount || 0} of {roadmap.progress?.totalCheckpoints || 0} checkpoints completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Updated Steps Structure */}
      <div className="flex-grow flex flex-col">
        <div className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-4">
              {roadmap.steps.map((step, stepIndex) => {
                const isLocked = isStepLocked(stepIndex)
                const isExpanded = expandedSteps.has(step.id)
//bg-gradient-to-r from-gray-100 to-gray-200
                return (
                  <div key={step.id} className={`rounded-lg border border-color ${theme === "dark" ? "bg-gradient-to-br from-[#0f0f0f] via-[#1e1e2f] to-[#000000]" : "bg-gradient-to-r from-gray-100 to-gray-200"}`}>
                    <div
                      className={`relative cursor-pointer p-4 md:p-6 transition-colors duration-200 ${
                        isLocked 
                          ? "opacity-80 bg-surface/80 dark:bg-surface/90" 
                          : "hover:bg-surface/50 dark:hover:bg-surface/70"
                      }`}
                      onClick={(e) => toggleStep(e, step.id)}
                    >
                      <div className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-gradient-to-b from-primary to-secondary" />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {isLocked && <Lock className="h-5 w-5 text-secondary" />}
                          <h2 className="text-lg font-semibold text-primary">{step.title}</h2>
                        </div>
                        <div className="flex items-center gap-3 text-secondary">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">{step.timeEstimate}</span>
                          </div>
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                      </div>
                    </div>

                    <Collapse isOpen={isExpanded}>
                      <div className="px-4 md:px-6">
                        <div className="space-y-3 pt-2 pb-2">
                          {step.checkpoints.map((checkpoint, index) => (
                            <div key={checkpoint.id} className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                className={`flex-grow justify-start gap-2 h-auto py-3 px-4 transition-colors duration-200 text-left border-color ${
                                  isCheckpointCompleted(step.id, checkpoint.id)
                                    ? "bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary dark:bg-primary/20 dark:hover:bg-primary/30"
                                    : isLocked
                                    ? "bg-surface/80 hover:bg-surface dark:bg-surface/90 dark:hover:bg-surface/100 text-gray-500 dark:text-gray-400"
                                    : "hover:bg-surface/50 dark:hover:bg-surface/70 text-primary"
                                }`}
                                onClick={(e) => !isLocked && handleCheckpointToggle(e, step.id, checkpoint.id)}
                                disabled={
                                  isLocked ||
                                  (index > 0 && !isCheckpointCompleted(step.id, step.checkpoints[index - 1].id))
                                }
                              >
                                {isCheckpointCompleted(step.id, checkpoint.id) ? (
                                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                                ) : (
                                  <Circle className="h-4 w-4 text-secondary flex-shrink-0" />
                                )}
                                <span className="text-sm md:text-base">{checkpoint.title}</span>
                              </Button>

                              {/* Add Dialog for checkpoint details */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-12 w-12 p-0 rounded-full hover:bg-surface/50 flex items-center justify-center flex-shrink-0"
                                  >
                                    <Info className="h-6 w-6 text-secondary hover:text-primary" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] bg-surface text-primary border-color">
                                  <DialogHeader className="pb-4">
                                    <DialogTitle className="text-xl font-semibold text-primary">
                                      {checkpoint.title}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <p className="text-base text-primary whitespace-pre-wrap">
                                      {checkpoint.description}
                                    </p>
                                  </div>
                                  {checkpoint.resources?.length > 0 && (
                                    <div className="mt-6 border-t border-color pt-4">
                                      <h4 className="font-semibold text-base mb-3 text-primary">
                                        Additional Resources:
                                      </h4>
                                      <ul className="list-disc pl-5 space-y-2">
                                        {checkpoint.resources.map((resource, idx) => (
                                          <li key={idx} className="text-base">
                                            <a
                                              href={resource.url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-secondary hover:text-primary hover:underline inline-flex items-center gap-1"
                                            >
                                              {resource.title}
                                              <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                />
                                              </svg>
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Collapse>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Completion Dialog */}
      <Dialog open={allCompleted}>
        <DialogContent className="sm:max-w-[600px] bg-surface border-color">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">
              Congratulations! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              You've completed the {roadmap.name} Roadmap
            </p>
            <p className="text-xl font-semibold mb-4">Achievement Unlocked! 🏆</p>
            <p className="text-muted-foreground">
              You've mastered all the checkpoints. Keep practicing and building amazing things!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default RoadmapDetail

