import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useTheme } from "@/src/theme";

interface Props {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 → 1
}

export const ActivityRing = ({
  size = 90,
  strokeWidth = 12,
  progress,
}: Props) => {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Svg width={size} height={size}>
      {/* Background ring */}
      <Circle
        stroke={theme.colors.surfaceHighlight}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        fill="none"
      />

      {/* Progress ring */}
      <Circle
        stroke={theme.colors.primary}
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
};
