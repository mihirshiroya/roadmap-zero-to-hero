import { useTheme } from '../context/ThemeContext';
import { useEffect } from 'react';

const LoadingSpinner = () => {
  const { theme } = useTheme();

  useEffect(() => {
    // Dynamically import the ldrs script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/ldrs/dist/auto/infinity.js';
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <l-infinity
        size="55"
        stroke="4"
        stroke-length="0.15"
        bg-opacity="0.1"
        speed="1.3"
        color={theme === 'dark' ? 'white' : 'black'}
      ></l-infinity>
    </div>
  );
};

export default LoadingSpinner; 