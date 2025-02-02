const Checkbox = ({ checked, onCheckedChange, disabled }) => {
    return (
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked, e)}
          disabled={disabled}
          className="w-4 h-4 rounded border-color bg-surface text-primary focus:ring-primary disabled:opacity-50"
        />
      </div>
    );
  };
  
  export default Checkbox;