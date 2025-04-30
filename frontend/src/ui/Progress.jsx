import { useTheme } from "../context/ThemeContext"

const Progress = ({ value }) => {
    const { theme } = useTheme()
    return (
      <div className={`w-full bg-surface border border-color rounded-full h-2.5 ${theme === "dark" ? "bg-gradient-to-br from-[#0f0f0f] via-[#1e1e2f] to-[#000000]" : "bg-gradient-to-r from-gray-100 to-gray-200"}`}>
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    );
  };
  
  export default Progress