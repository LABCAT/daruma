

import { createSignal, createEffect, onCleanup } from "solid-js";
import "./ThemeToggle.scss";

export function ThemeToggle() {
  const [theme, setTheme] = createSignal("light");

  createEffect(() => {
    if (typeof window === "undefined" || typeof localStorage === "undefined") return;

    const savedTheme = localStorage.getItem("dm-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (prefersDark.matches) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("dm-theme")) {
        const newTheme = e.matches ? "dark" : "light";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      }
    };

    prefersDark.addEventListener("change", handleChange);
    onCleanup(() => prefersDark.removeEventListener("change", handleChange));
  });

  const toggleTheme = () => {
    const newTheme = theme() === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("dm-theme", newTheme);
  };

  return (
    <button 
      class="dm-theme-toggle" 
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme() === "light" ? "☾ Dark" : "☼ Light"}
    </button>
  );
}
