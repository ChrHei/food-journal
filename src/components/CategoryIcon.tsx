import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, Line, Path, Rect } from "react-native-svg";

import type { CategoryType } from "@/domain/categories";

type CategoryIconProps = {
  category: CategoryType | "Symptom";
  size?: number;
};

const STROKE = "#231d1a";
const CREAM = "#fff8f0";
const SKY = "#d8edf7";
const BOWL = "#9bc4d2";
const GOLD = "#f3b63f";
const ORANGE = "#f5a049";
const RED = "#c53b3d";
const YELLOW = "#f7c14f";
const BLUE = "#88b4df";
const LAVENDER = "#c5b1ec";
const GREEN = "#88b36e";
const MINT = "#a8d6b5";
const PINK = "#ec8b90";
const TEAL = "#73b7b6";
const PAPER = "#fffefb";
const GRAY = "#8d969d";

export function CategoryIcon({ category, size = 36 }: CategoryIconProps) {
  const strokeWidth = size / 16;
  const innerSize = size * 0.76;

  return (
    <View style={[styles.frame, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={innerSize} height={innerSize} viewBox="0 0 64 64" fill="none">
        {renderCategoryShape(category, strokeWidth)}
      </Svg>
    </View>
  );
}

function renderCategoryShape(category: CategoryType | "Symptom", strokeWidth: number): ReactNode {
  switch (category) {
    case "Frukost":
      return (
        <>
          <Circle cx="19" cy="21" r="9" fill={YELLOW} stroke={STROKE} strokeWidth={strokeWidth} />
          <Path
            d="M10 40c0-6 4-10 10-10h24c5 0 9 4 9 9v7c0 4-3 7-7 7H18c-5 0-8-3-8-8z"
            fill={BOWL}
            stroke={STROKE}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <Path d="M10 39h43" stroke={STROKE} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Circle cx="21" cy="25" r="3" fill={GOLD} />
          <Circle cx="28" cy="21" r="3" fill={GOLD} />
          <Circle cx="35" cy="24" r="3" fill={GOLD} />
          <Line x1="43" y1="20" x2="54" y2="11" stroke={STROKE} strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      );
    case "Lunch":
      return (
        <>
          <Circle cx="32" cy="33" r="15" fill={PAPER} stroke={STROKE} strokeWidth={strokeWidth} />
          <Ellipse cx="32" cy="33" rx="8" ry="8" fill={GREEN} />
          <Line x1="12" y1="16" x2="12" y2="50" stroke={STROKE} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="8" y1="18" x2="16" y2="18" stroke={STROKE} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="8" y1="25" x2="16" y2="25" stroke={STROKE} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="52" y1="16" x2="52" y2="50" stroke={STROKE} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Ellipse cx="52" cy="20" rx="4" ry="6" fill={GRAY} stroke={STROKE} strokeWidth={strokeWidth} />
        </>
      );
    case "Middag":
      return (
        <>
          <Path
            d="M14 38c3-10 10-16 18-16s15 6 18 16"
            fill={LAVENDER}
            stroke={STROKE}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <Path d="M10 38h44v5c0 5-4 9-9 9H19c-5 0-9-4-9-9z" fill={PAPER} stroke={STROKE} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <Path d="M20 27h24" stroke={STROKE} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Circle cx="32" cy="20" r="3" fill={RED} stroke={STROKE} strokeWidth={strokeWidth} />
        </>
      );
    case "Mellanmål":
      return (
        <>
          <Path
            d="M32 18c8 0 15 7 15 16 0 11-7 18-15 18s-15-7-15-18c0-9 7-16 15-16z"
            fill={RED}
            stroke={STROKE}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <Path d="M32 18c1-5 5-8 10-8" stroke={STROKE} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Path
            d="M37 14c3-4 8-4 11-1-3 4-8 5-11 1z"
            fill={GREEN}
            stroke={STROKE}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <Path d="M25 31c4 2 10 2 14 0" stroke={PINK} strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      );
    case "Kvällsmat":
      return (
        <>
          <Path
            d="M20 17c4 0 7 3 7 7 0 5-4 9-9 9-3 0-6-2-7-5 3 1 7 0 9-2 2-2 3-5 2-9 1 0 2 0 3 0z"
            fill={YELLOW}
            stroke={STROKE}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <Rect x="15" y="30" width="28" height="19" rx="6" fill={BLUE} stroke={STROKE} strokeWidth={strokeWidth} />
          <Path d="M43 34h4c4 0 7 3 7 7s-3 7-7 7h-4" stroke={STROKE} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Path d="M20 37h18" stroke={STROKE} strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      );
    case "Dryck":
      return (
        <>
          <Path
            d="M18 12h28l-3 36c0 3-3 6-6 6H27c-3 0-6-3-6-6z"
            fill={SKY}
            stroke={STROKE}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <Path
            d="M20 29c5-3 9-2 14 0 4 2 8 3 12 0v17c0 4-3 8-7 8H27c-4 0-7-4-7-8z"
            fill={YELLOW}
            stroke={STROKE}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <Ellipse cx="32" cy="12" rx="14" ry="3" fill={CREAM} stroke={STROKE} strokeWidth={strokeWidth} />
        </>
      );
    case "Medicin":
      return (
        <>
          <Rect x="18" y="12" width="20" height="16" rx="4" fill={CREAM} stroke={STROKE} strokeWidth={strokeWidth} />
          <Rect x="14" y="24" width="28" height="28" rx="7" fill={PINK} stroke={STROKE} strokeWidth={strokeWidth} />
          <Rect x="24" y="18" width="8" height="5" rx="2" fill={GRAY} />
          <Path d="M20 38h16" stroke={CREAM} strokeWidth={strokeWidth * 1.4} strokeLinecap="round" />
          <Path d="M28 30v16" stroke={CREAM} strokeWidth={strokeWidth * 1.4} strokeLinecap="round" />
          <Path
            d="M44 39c0-4 3-7 7-7h1v14h-1c-4 0-7-3-7-7z"
            fill={YELLOW}
            stroke={STROKE}
            strokeWidth={strokeWidth}
          />
          <Path d="M52 32c4 0 7 3 7 7s-3 7-7 7" fill={RED} stroke={STROKE} strokeWidth={strokeWidth} />
        </>
      );
    case "Anteckning":
      return (
        <>
          <Rect x="15" y="10" width="30" height="42" rx="5" fill={PAPER} stroke={STROKE} strokeWidth={strokeWidth} />
          <Line x1="22" y1="22" x2="38" y2="22" stroke={GRAY} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="22" y1="29" x2="38" y2="29" stroke={GRAY} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Line x1="22" y1="36" x2="34" y2="36" stroke={GRAY} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Path
            d="M35 44l11-11 5 5-11 11-8 2z"
            fill={ORANGE}
            stroke={STROKE}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          <Path d="M44 35l5 5" stroke={STROKE} strokeWidth={strokeWidth} strokeLinecap="round" />
        </>
      );
    case "Symptom":
      return (
        <>
          <Circle cx="29" cy="30" r="18" fill={MINT} stroke={STROKE} strokeWidth={strokeWidth} />
          <Circle cx="23" cy="27" r="2.5" fill={STROKE} />
          <Circle cx="35" cy="27" r="2.5" fill={STROKE} />
          <Path d="M22 39c2-3 5-4 7-4s5 1 7 4" stroke={STROKE} strokeWidth={strokeWidth} strokeLinecap="round" />
          <Path
            d="M46 16c0-3 2-5 5-5 2 0 4 1 5 3 1 2 0 4-1 6l-8 11-8-11c-1-2-2-4-1-6 1-2 3-3 5-3 3 0 5 2 5 5z"
            fill={RED}
            stroke={STROKE}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </>
      );
  }
}

const styles = StyleSheet.create({
  frame: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CREAM,
    borderWidth: 1.5,
    borderColor: "rgba(35, 29, 26, 0.08)",
    shadowColor: "#28150a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
});
