import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizStats } from "../Slicers/quizStatsSlice";

const topics = [
  { id: 'Linux', name: 'Linux', icon: '🐧' },
  { id: 'DevOps', name: 'DevOps', icon: '🔧' },
  { id: 'Docker', name: 'Docker', icon: '🐳' },
  { id: 'Kubernetes', name: 'Kubernetes', icon: '☸️' },
  { id: 'JavaScript', name: 'JavaScript', icon: '📜' },
  { id: 'PHP', name: 'PHP', icon: '🐘' },
  { id: 'SQL', name: 'SQL', icon: '🗃️' },
  { id: 'HTML', name: 'HTML', icon: '🌐' },
  { id: 'Python', name: 'Python', icon: '🐍' },
  { id: 'Bash', name: 'Bash', icon: '💻' },
  { id: 'Laravel', name: 'Laravel', icon: '🚀' },
  { id: 'Django', name: 'Django', icon: '🎸' }
];

export default function Quizzes() {
  const dispatch = useDispatch();
  const quizStats = useSelector((state) => state.quizStats);
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizStats());
  }, [dispatch]);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  const handleDifficultySelect = (difficulty) => {
    navigate(`/quiz/${selectedTopic.id}/${difficulty}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface p-6 rounded-lg border-2 border-color">
          <h3 className="text-lg font-semibold text-primary mb-2">Quizzes Attempted</h3>
          <p className="text-2xl font-bold text-primary">{quizStats?.attempts ?? 0}</p>
        </div>
        <div className="bg-surface p-6 rounded-lg border-2 border-color">
          <h3 className="text-lg font-semibold text-primary mb-2">Correct Answers</h3>
          <p className="text-2xl font-bold text-primary">
            {quizStats?.correctAnswers ?? 0}/{quizStats?.totalQuestions ?? 0}
          </p>
        </div>
        <div className="bg-surface p-6 rounded-lg border-2 border-color">
          <h3 className="text-lg font-semibold text-primary mb-2">Accuracy</h3>
          <p className="text-2xl font-bold text-primary">{quizStats?.accuracy ?? 0}%</p>
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-primary">Quizzes</h1>
      
      {!selectedTopic ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicSelect(topic)}
              className="bg-surface border border-color rounded-lg p-6 hover:border-primary transition-colors text-left"
            >
              <div className="text-3xl mb-2">{topic.icon}</div>
              <h3 className="text-lg font-medium text-primary">{topic.name}</h3>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Select Difficulty</h2>
          <div className="flex gap-4">
            {['easy', 'medium', 'hard'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => handleDifficultySelect(difficulty)}
                className="bg-surface border border-color rounded-lg px-6 py-3 capitalize hover:border-primary transition-colors"
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
