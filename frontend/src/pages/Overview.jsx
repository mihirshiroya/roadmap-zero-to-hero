import React, { Fragment, useState, useEffect, useMemo } from "react"
import { Dialog, Transition } from "@headlessui/react"
import {
  Bars3Icon,
  ChartPieIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline"
import Header from '../components/Header'
import { TrendingUp, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoadmaps } from '../Slicers/roadmapSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLocation, Link, useNavigate } from "react-router-dom"
import Progress from "../ui/Progress";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { CheckCircle } from 'lucide-react';
import Button from '../ui/Button';
import { allProjects } from './Projects';
import { useTheme } from "../context/ThemeContext"

export default function Overview() {
  const dispatch = useDispatch();
  const { roadmaps, loading, error } = useSelector((state) => state.roadmaps);
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);
  const { theme } = useTheme()
  
  // Memoize the project selection
  const projects = useMemo(() => {
    if (!Array.isArray(allProjects)) return [];
    
    try {
      const shuffled = [...allProjects].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.floor(Math.random() * 6) + 5);
    } catch (error) {
      console.error('Project selection error:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    dispatch(fetchRoadmaps());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-error">Error loading roadmaps: {error}</div>;

  // Ensure roadmaps is an array before filtering
  const ongoingRoadmaps = Array.isArray(roadmaps) 
    ? roadmaps.filter(roadmap => {
        const progress = roadmap?.progress?.percentage ?? 0;
        return progress > 0 && progress < 100;
      })
    : [];

  const topics = [
    { id: 'HTML', name: 'HTML', icon: '🌐' },
    { id: 'JavaScript', name: 'JavaScript', icon: '📜' },
    { id: 'SQL', name: 'SQL', icon: '🗃️' }
  ];

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleDifficultySelect = (difficulty) => {
    navigate(`/quiz/${selectedTopic.id}/${difficulty}`);
  };

  // Check if projects data is valid
  if (!Array.isArray(allProjects)) {
    return (
      <div className="p-4 text-red-500">
        Error: Projects data failed to load. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {!selectedTopic ? (
        <>
          <h1 className="text-2xl font-semibold text-primary">Dashboard Overview</h1>

          {/* Roadmap Progress */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-primary">Current Roadmap Progress</h2>
            {ongoingRoadmaps.length > 0 ? (
              <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {ongoingRoadmaps.map((roadmap) => (
                  <Link 
                    key={roadmap._id} 
                    to={`/roadmaps/${roadmap._id}`}
                    className="block"
                  >
                    <Card className={`hover:border-primary transition-colors bg-background border-color ${theme === "dark" ? "bg-gradient-to-br from-[#0f0f0f] via-[#1e1e2f] to-[#000000]" : "bg-gradient-to-r from-gray-100 to-gray-200"}`}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="bg-background/20 p-2 rounded-lg border border-color">
                            {roadmap.logo_url ? (
                              <img 
                                src={roadmap.logo_url} 
                                alt={roadmap.name}
                                className="w-10 h-10 object-contain rounded-md"
                              />
                            ) : (
                              <div className="w-10 h-10 flex items-center justify-center text-primary">
                                <AcademicCapIcon className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <CardTitle className="text-primary">
                            {roadmap.name}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-secondary mb-4">
                          Expected completion: {roadmap.expected_completion_time}
                        </p>
                        <Progress 
                          value={roadmap.progress?.percentage ?? 0} 
                          className="bg-primary/20"
                          indicatorClassName="bg-primary"
                        />
                        <p className="mt-2 text-sm text-secondary">
                          {roadmap.progress?.completedCount ?? 0} of {roadmap.progress?.totalCheckpoints ?? 0} checkpoints completed
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="text-secondary mb-2">📭 No active roadmaps found</div>
                <p className="text-sm text-secondary">
                  Start a new learning journey from our{' '}
                  <Link to="/roadmaps" className="text-primary hover:underline">
                    Roadmaps section
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* Rest of the component remains the same */}
          {/* Suggested Quizzes */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-primary">Suggested Quizzes</h2>
            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <div 
                  key={topic.id}
                  className={`bg-background border border-color rounded-lg p-6 transition-colors ${theme === "dark" ? "bg-gradient-to-br from-[#0f0f0f] via-[#1e1e2f] to-[#000000]" : "bg-gradient-to-r from-gray-100 to-gray-200"}`}
                >
                  <div className="text-3xl mb-2">{topic.icon}</div>
                  <h3 className="text-lg font-medium text-primary">{topic.name}</h3>
                  <Button
                    onClick={() => handleTopicSelect(topic)}
                    className="w-full mt-4"
                  >
                    Start Quiz
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Projects */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-primary">Recommended Projects</h2>
            <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {projects.map((project) => (
                <li key={project.id} className="col-span-1 flex rounded-lg group bg-background">
                  <div className="flex flex-1 items-center justify-between truncate rounded-lg bg-background border border-color hover:border-primary transition-colors">
                    <div className="flex-1 min-w-0 px-4 py-2">
                      <h3 className="text-sm font-medium text-primary truncate">{project.title}</h3>
                      <p className="mt-1 text-sm text-secondary overflow-hidden">
                        <span className="marquee">{project.description}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0 pr-2">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-surface text-secondary hover:text-primary"
                      >
                        <RocketLaunchIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary">Select Difficulty Level</h2>
          <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {['easy', 'medium', 'hard'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => handleDifficultySelect(difficulty)}
                className="bg-surface border border-color rounded-lg p-6 hover:border-primary transition-colors text-center capitalize"
              >
                <span className="text-xl font-medium text-primary">{difficulty}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}