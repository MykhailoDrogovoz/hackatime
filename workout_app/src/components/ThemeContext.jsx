import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const saved = localStorage.getItem("gradient-theme");
    return saved === "true";
  };

  const [isGradient, setIsGradient] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("gradient-theme", isGradient);
  }, [isGradient]);

  const toggleTheme = () => {
    setIsGradient((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isGradient, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
