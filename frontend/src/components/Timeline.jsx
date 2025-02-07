import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { format } from "date-fns"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { fetchTimelineData } from "../Slicers/analyticsSlice"

export default function Timeline() {
  const dispatch = useDispatch()
  const { timelineData, loading, error } = useSelector((state) => state.analytics)
  const activeRoadmapId = useSelector((state) => state.roadmaps.activeRoadmapId)
  
  // Add mobile detection state
  const [isMobile, setIsMobile] = useState(false)

  // Add resize listener for mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Update data fetching to include roadmap ID
  useEffect(() => {
    dispatch(fetchTimelineData(activeRoadmapId))
  }, [dispatch, activeRoadmapId]) // Add roadmap ID as dependency

  // Generate fake test data (30 days)
 

  // Modify data generation to show last 7 days on mobile
  const chartData = timelineData
    .slice(isMobile ? -7 : 0)
    .map((item) => ({
      date: format(new Date(item._id), "d/M"),
      count: item.count,
    }))

  if (loading) return <div className="flex justify-center items-center h-64">Loading timeline...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>
  if (chartData.length === 0) return <div className="flex justify-center items-center h-64 text-gray-500">No completion data available for this period</div>

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="text-gray-600">{`Date: ${label}`}</p>
          <p className="text-indigo-600 font-bold">{`Checkpoints: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full bg-background p-4 md:p-6"> {/* Modified padding */}
      <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-primary">Completion Timeline</h2>
      <div className="h-[250px] md:h-[300px]"> {/* Adjusted height for mobile */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 15, right: isMobile ? 10 : 30, left: 10, bottom: 5 }} // Adjusted margins
            barSize={isMobile ? 20 : 40} // Smaller bars on mobile
          >
            <XAxis 
              dataKey="date" 
              stroke="#6B7280"
              fontSize={isMobile ? 10 : 12} // Smaller font on mobile
              interval={0} // Force show all labels
              tickLine={false} 
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: "#E5E7EB" }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#3B82F6"
              radius={isMobile ? [2, 2, 0, 0] : [4, 4, 0, 0]} // Smaller radius on mobile
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

