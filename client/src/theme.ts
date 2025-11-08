// theme.ts
import {AliasToken} from "antd/es/theme/interface";
import {CSSProperties} from "react";

const theme = {
  primary: "#0c66e4",
  secondary: "#9333EA",

  overlay: "#c8d1da66",
} as const;

const themeBody = {
  "--overlay": theme.overlay
} as CSSProperties

const themeAntd = {
  colorPrimary: theme.primary,
  fontFamily: "var(--font-geist-sans), sans-serif",
} as Partial<AliasToken>

export default theme
export {themeBody, themeAntd}