// ... existing imports ...
import { format } from 'date-fns';
import { useEffect } from 'react';
import Timeline from '../components/Timeline';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompletionHistory } from '../Slicers/analyticsSlice';
import { fetchRoadmaps, setActiveRoadmap } from '../Slicers/roadmapSlice';

export default function Analytics() {
    const dispatch = useDispatch();
    const { completionHistory, loading, error } = useSelector((state) => state.analytics);
    const { roadmaps, loading: roadmapsLoading, activeRoadmapId } = useSelector((state) => state.roadmaps);

    useEffect(() => {
        dispatch(fetchRoadmaps());
    }, [dispatch]);

    useEffect(() => {
        if (activeRoadmapId || activeRoadmapId === null) {
            dispatch(fetchCompletionHistory(activeRoadmapId));
        }
    }, [dispatch, activeRoadmapId]);

    const getCheckpointName = (item) => {
        const checkpointId = item.checkpointId;
        if (roadmapsLoading || !checkpointId) return 'Loading...';
        if (!roadmaps) return 'N/A';
        
        // First try to find in the associated roadmap
        if (item.roadmap?._id) {
            const roadmap = roadmaps.find(r => r._id === item.roadmap._id);
            if (roadmap) {
                for (const step of roadmap.steps) {
                    const checkpoint = step.checkpoints.find(cp => cp.id === checkpointId);
                    if (checkpoint) return checkpoint.title;
                }
            }
        }

        // Fallback to searching all roadmaps
        for (const roadmap of roadmaps) {
            for (const step of roadmap.steps) {
                const checkpoint = step.checkpoints.find(cp => cp.id === checkpointId);
                if (checkpoint) return checkpoint.title;
            }
        }
        return 'N/A';
    };

    // Updated active roadmap detection
    const activeRoadmapIds = roadmaps?.filter(r => 
        (r.progress?.percentage || 0) < 100
    ).map(r => r._id) || [];

    // Updated filtering logic
    const filteredHistory = activeRoadmapId
        ? completionHistory.filter(item => item.roadmap?._id === activeRoadmapId)
        : completionHistory;

    return (
        <div className="space-y-8">
            {/* Existing progress components */}
            <Timeline />
            
            <div className="bg-background p-6">
                <h2 className="text-2xl font-bold mb-4 text-primary">
                    {activeRoadmapId ? 'Roadmap History' : 'Active Roadmaps History'}
                </h2>
                <div className="space-y-4">
                    {filteredHistory.map(item => (
                        <div key={item._id} className="flex justify-between items-center p-3 bg-background rounded border border-color hover:bg-background/90 transition-colors">
                            <div>
                                <h3 className="font-medium text-primary">{getCheckpointName(item)}</h3>
                                <p className="text-sm text-gray-500">
                                    Completed {format(new Date(item.completedAt), 'MMM dd, yyyy HH:mm')}
                                </p>
                            </div>
                        </div>
                    ))}
                    {filteredHistory.length === 0 && !loading && (
                        <p className="text-gray-400 text-center py-4">
                            {activeRoadmapId 
                                ? 'No history for this roadmap'
                                : roadmapsLoading 
                                    ? 'Loading roadmaps...'
                                    : activeRoadmapIds?.length === 0
                                        ? 'No active roadmaps found'
                                        : completionHistory.length === 0
                                            ? 'No completions recorded yet'
                                            : 'No matching completions found'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}