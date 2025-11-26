// theme.ts
import {AliasToken} from "antd/es/theme/interface";
import {CSSProperties} from "react";

const theme = {
  primary: "#0C66E4", // #FFAA40,fbbf24, ea580cff, f4d666ff
  secondary: "#78ebff",

  overlay: "#c8d1da66",
} as const;

const themeBody = {
  "--overlay": theme.overlay
} as CSSProperties

const themeAntd = {
  colorPrimary: theme.primary,
  fontFamily: "var(--font-geist-sans), sans-serif",
} as Partial<AliasToken>

const themeAntdLight = {
  ...themeAntd,
  colorBgMask: theme.overlay,
} as Partial<AliasToken>

const themeAntdDark = {
  ...themeAntd
} as Partial<AliasToken>

export default theme
export {themeBody, themeAntd, themeAntdLight, themeAntdDark}