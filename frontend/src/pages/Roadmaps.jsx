import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchRoadmaps } from '../Slicers/roadmapSlice';
import Progress from "../ui/Progress";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from "../context/ThemeContext"

const Roadmaps = () => {
  const dispatch = useDispatch();
  const { roadmaps, loading, error } = useSelector((state) => state.roadmaps);
  const [activeTab, setActiveTab] = useState('browse');
  const navigate = useNavigate();
  const { theme } = useTheme()
  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const progress = roadmap.progress?.percentage || 0;
    
    if (activeTab === 'browse') {
      // Show only roadmaps with 0% progress (not started)
      return progress === 0;
    }
    if (activeTab === 'ongoing') {
      return progress > 0 && progress < 100;
    }
    if (activeTab === 'completed') {
      return progress >= 100;
    }
    return true;
  });

  useEffect(() => {
    dispatch(fetchRoadmaps());
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="text-error">Error: {error}</div>
      </div>
    );
  }

  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-primary">Roadmaps</h1>
        <div className="mt-6">
          <p className="text-secondary">No roadmaps available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-primary">Roadmaps</h1>
        <div className="flex gap-2 border border-color rounded-lg p-1 bg-background">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'browse' 
                ? 'bg-primary text-surface' 
                : 'text-secondary hover:bg-surface/80'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'ongoing' 
                ? 'bg-primary text-surface' 
                : 'text-secondary hover:bg-surface/80'
            }`}
          >
            Ongoing
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'completed' 
                ? 'bg-primary text-surface' 
                : 'text-secondary hover:bg-surface/80'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {filteredRoadmaps.length === 0 ? (
        <div className="bg-background/50 border border-color rounded-lg p-6 text-center mt-16">
          <p className="text-secondary text-lg">
            {activeTab === 'browse' 
              ? "No new roadmaps available to start." 
              : activeTab === 'ongoing' 
                ? "You don't have any ongoing roadmaps." 
                : "You haven't completed any roadmaps yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRoadmaps.map((roadmap) => (
            <Link 
              key={roadmap._id} 
              to={`/roadmaps/${roadmap._id}`}
              className="block"
            >
              <Card className={`hover:border-primary transition-colors  dark:bg-background/80 border-color ${theme === "dark" ? "bg-gradient-to-br from-[#0f0f0f] via-[#1e1e2f] to-[#000000]" : "bg-gradient-to-r from-gray-100 to-gray-200"}`}>
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
                          <svg 
                            className="w-6 h-6" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-primary dark:text-primary/90">
                      {roadmap.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary dark:text-secondary/80 mb-4">
                    Expected completion: {roadmap.expected_completion_time}
                  </p>
                  
                  {!roadmap.progress?.percentage ? (
                    <button
                      className="w-full bg-primary text-surface px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        // Navigate to roadmap details
                        navigate(`/roadmaps/${roadmap._id}`);
                      }}
                    >
                      Start Roadmap
                    </button>
                  ) : roadmap.progress?.percentage >= 100 ? (
                    <div className="flex items-center gap-2 text-success dark:text-success/80">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Completed</span>
                    </div>
                  ) : (
                    <>
                      <Progress 
                        value={roadmap.progress?.percentage || 0} 
                        className="bg-primary/20 dark:bg-primary/10"
                        indicatorClassName="bg-primary dark:bg-primary/80"
                      />
                      <p className="mt-2 text-sm text-secondary dark:text-secondary/80">
                        {roadmap.progress?.completedCount || 0} of {roadmap.progress?.totalCheckpoints || 0} checkpoints completed
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Roadmaps;
