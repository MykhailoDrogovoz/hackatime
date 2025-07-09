import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const stored = localStorage.getItem("gradient-theme");
  const initialIsGradient = stored || systemPrefersDark;

  const [isGradient, setIsGradient] = useState(initialIsGradient);
  console.log("sfdsf ", isGradient);

  const [userHasChosen, setUserHasChosen] = useState(stored !== null);

  const [isDarkMode, setIsDarkMode] = useState(systemPrefersDark);

  useEffect(() => {
    const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
      if (!userHasChosen) {
        // Update theme dynamically if user hasn't chosen yet
        setIsGradient(e.matches);
      }
    };
    matchDark.addEventListener("change", handleChange);
    return () => matchDark.removeEventListener("change", handleChange);
  }, [userHasChosen]);

  // Save only if user has manually toggled
  useEffect(() => {
    if (userHasChosen) {
      localStorage.setItem("gradient-theme", isGradient);
    }
  }, [isGradient, userHasChosen]);

  const toggleTheme = () => {
    setUserHasChosen(true); // Now persist future changes
    setIsGradient((prev) => !prev);
  };

  console.log("dsfs ", isGradient);

  return (
    <ThemeContext.Provider value={{ isGradient, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
