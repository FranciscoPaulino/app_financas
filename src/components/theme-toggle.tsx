"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

const options = [
  { value: "light", label: "Modo claro", icon: Sun },
  { value: "dark", label: "Modo escuro", icon: Moon },
  { value: "system", label: "Usar tema do sistema", icon: Monitor },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  return (
    <div role="group" aria-label="Tema" className="flex rounded-md border bg-card p-0.5">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={mounted && theme === value}
          onClick={() => setTheme(value)}
          className={cn(
            "flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm text-muted-foreground hover:text-foreground",
            mounted && theme === value && "bg-secondary text-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
