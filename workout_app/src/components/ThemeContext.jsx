import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const stored = localStorage.getItem("gradient-theme");
  const initialIsGradient = stored === "true" || systemPrefersDark;

  const [isGradient, setIsGradient] = useState(initialIsGradient);
  console.log("sfdsf ", isGradient);

  const [userHasChosen, setUserHasChosen] = useState(stored !== null);

  const [isDarkMode, setIsDarkMode] = useState(systemPrefersDark);

  useEffect(() => {
    const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
      if (!userHasChosen) {
        setIsGradient(e.matches);
      }
    };
    matchDark.addEventListener("change", handleChange);
    return () => matchDark.removeEventListener("change", handleChange);
  }, [userHasChosen]);

  useEffect(() => {
    if (userHasChosen) {
      localStorage.setItem("gradient-theme", isGradient);
    }
  }, [isGradient, userHasChosen]);

  const toggleTheme = () => {
    setUserHasChosen(true);
    setIsGradient((prev) => !prev);
  };

  useEffect(() => {
    const className = "gradient-bg";
    const appElement = document.querySelector(".App");
    console.log(typeof isGradient);
    if (appElement) {
      if (isGradient) {
        appElement.classList.add(className);
      } else {
        appElement.classList.remove(className);
      }
    }
  }, [isGradient]);

  return (
    <ThemeContext.Provider value={{ isGradient, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
