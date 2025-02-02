const Progress = ({ value }) => {
    return (
      <div className="w-full bg-surface border border-color rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${value}%` }}
        />
      </div>
    );
  };
  
  export default Progress