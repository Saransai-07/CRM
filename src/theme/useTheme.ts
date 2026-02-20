// src/theme/useTheme.ts

import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";
import type { Theme } from "./theme";

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};

/**
 * Creates themed styles that update when theme changes.
 * Use this when your styles depend on theme colors/values.
 *
 * @example
 * const styles = useThemedStyles((t) =>
 *   StyleSheet.create({
 *     container: { backgroundColor: t.colors.background },
 *     title: { ...t.typography.largeTitle, color: t.colors.textPrimary },
 *   })
 * );
 */
export const useThemedStyles = <
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>
>(
  styleFactory: (theme: Theme) => T
): T => {
  const theme = useTheme();
  return useMemo(() => styleFactory(theme), [theme]);
};
