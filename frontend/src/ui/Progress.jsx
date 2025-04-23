import { useTheme } from "../context/ThemeContext"

const Progress = ({ value }) => {
    const { theme } = useTheme()
    return (
      <div className={`w-full bg-surface border border-color rounded-full h-2.5 ${theme === "dark" ? "bg-gradient-to-r from-gray-900 via-gray-800 to-black" : "bg-gradient-to-r from-gray-100 to-gray-200"}`}>
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    );
  };
  
  export default Progress