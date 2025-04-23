export function Tabs({ children, className = "" }) {
    return <div className={`space-y-4 ${className}`}>{children}</div>
  }
  
  export function TabsList({ children, fullWidth = false }) {
    return <div className={`flex rounded-xl bg-background p-1 border border-color ${fullWidth ? "w-full" : ""}`}>{children}</div>
  }
  
  export function TabsTrigger({ children, isActive, onClick, fullWidth = false }) {
    return (
      <button
        className={`px-3 py-2 text-sm font-medium transition-all ${
          isActive ? "bg-primary text-surface shadow-sm" : "text-secondary hover:bg-primary/10 hover:text-primary"
        } rounded-lg ${fullWidth ? "flex-1 text-center" : ""}`}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
  
  export function TabsContent({ children, isActive }) {
    if (!isActive) return null
    return <div>{children}</div>
  }
  
  export function Card({ children }) {
    return <div className="rounded-lg border border-color bg-background text-primary shadow-sm">{children}</div>
  }
  
  export function CardHeader({ children }) {
    return <div className="flex flex-col space-y-1.5 p-6">{children}</div>
  }
  
  export function CardTitle({ children }) {
    return <h3 className="text-lg font-semibold leading-none tracking-tight text-primary">{children}</h3>
  }
  
  export function CardDescription({ children }) {
    return <p className="text-sm text-secondary">{children}</p>
  }
  
  