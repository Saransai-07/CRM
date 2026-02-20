// src/theme/ThemeContext.tsx

import React, { createContext, ReactNode } from "react";
import { theme, Theme } from "./theme";

export const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
