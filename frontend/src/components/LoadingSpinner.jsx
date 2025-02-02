import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = () => {
  const { theme } = useTheme();

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full animate-bounce bg-primary"></div>
        <div className="w-3 h-3 rounded-full animate-bounce200 bg-primary"></div>
        <div className="w-3 h-3 rounded-full animate-bounce400 bg-primary"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 