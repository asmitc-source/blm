import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "blm-theme";

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggle: () => {},
  setTheme: () => {},
});

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export const themeBootScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||(t!=="light"&&d))document.documentElement.classList.add("dark")}catch(e){}})();`;

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private mode */
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
        setTheme: setThemeState,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className="glass-icon inline-flex size-11 items-center justify-center rounded-full"
      aria-label={next === "dark" ? "Switch to dark mode" : "Switch to light mode"}
      onClick={toggle}
    >
      {theme === "dark" ? (
        <Sun className="relative z-[1] size-5" strokeWidth={2.2} />
      ) : (
        <Moon className="relative z-[1] size-5" strokeWidth={2.2} />
      )}
    </button>
  );
}
