/**
 * iPhone Fitness app–inspired dark theme
 * Reference: Apple Fitness app with permanent black background,
 * vibrant accents, and structured data visualization
 */

export const theme = {
  colors: {
    // Core surfaces
    background: "#000000",
    surface: "#1C1C1E",
    surfaceElevated: "#2C2C2E",
    surfaceHighlight: "#3A3A3C",

    // Text
    textPrimary: "#FFFFFF",
    textSecondary: "rgba(235, 235, 245, 0.6)",
    textTertiary: "rgba(235, 235, 245, 0.4)",

    // Accent - Apple Fitness green
    accent: "#30D158",
    accentMuted: "rgba(48, 209, 88, 0.2)",

    // Semantic (for charts, activity rings, etc.)
    primary: "#30D158",
    secondary: "#64D2FF", // blue for secondary metrics
    danger: "#FF453A",
    warning: "#FF9F0A",

    // Borders & dividers
    border: "rgba(255, 255, 255, 0.06)",
    borderStrong: "rgba(255, 255, 255, 0.12)",
    divider: "rgba(84, 84, 88, 0.65)",
  },

  typography: {
    // Large title - screen headers
    largeTitle: {
      fontSize: 34,
      fontWeight: "700" as const,
      letterSpacing: -0.5,
    },
    // Title - section headers
    title1: {
      fontSize: 28,
      fontWeight: "700" as const,
    },
    title2: {
      fontSize: 22,
      fontWeight: "700" as const,
    },
    title3: {
      fontSize: 20,
      fontWeight: "600" as const,
    },
    // Body
    body: {
      fontSize: 17,
      fontWeight: "400" as const,
    },
    bodyBold: {
      fontSize: 17,
      fontWeight: "600" as const,
    },
    // Labels
    callout: {
      fontSize: 16,
      fontWeight: "400" as const,
    },
    footnote: {
      fontSize: 13,
      fontWeight: "400" as const,
    },
    caption1: {
      fontSize: 12,
      fontWeight: "400" as const,
    },
    caption2: {
      fontSize: 11,
      fontWeight: "400" as const,
    },
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  gap :{
    margin: 4
  }
  
} as const;

export type Theme = typeof theme;
