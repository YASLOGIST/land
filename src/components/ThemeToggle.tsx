import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export function ThemeToggle({ variant = 'button', className }: { variant?: 'button' | 'switch', className?: string }) {
  const { setTheme, resolvedTheme } = useTheme()

  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  if (variant === 'switch') {
    return (
      <div className={`flex items-center space-x-2 ${className || ''}`}>
        <Sun className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        <Switch 
          checked={isDark} 
          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
          aria-label="Toggle theme"
        />
        <Moon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      </div>
    )
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className={`w-9 h-9 ${className || ''}`}>
      {isDark ? (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
