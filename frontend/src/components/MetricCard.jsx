import { useTheme } from '../context/ThemeContext';

const MetricCard = ({ title, value, icon, color }) => {
  const { theme } = useTheme();

  return (
    <div className="bg-surface p-6 rounded-xl shadow-lg">
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-secondary font-medium mb-1">{title}</h3>
      <p className="text-primary text-2xl font-semibold">{value}</p>
    </div>
  );
};

export default MetricCard; 