// theme.ts
import {AliasToken} from "antd/es/theme/interface";
import {CSSProperties} from "react";

const theme = {
  primary: "#0c66e4",
  secondary: "#9333EA",
  background: "#FAFBFC",
  foreground: "#f8f8f8",

  leadDark: '#172b4d',
  leadLight: '#5e6c84',
  leadLighter: '#44546F',

  muted: "#f6f8fa",
  mutedDark: "#eff2f5",

  neutralEmphasis: "#59636e",
  neutralMuted: "#818b981a",

  dark: "#1f2328",
  darkMuted: "#1f232826",

  border: "#d1d9e0",
  borderMuted: "#d1d9e0b3",

  overlay: "#c8d1da66",

  linkColor: "#1677FF"
} as const;

const themeBody = {
  "--primary": theme.primary,
  "--secondary": theme.secondary,
  "--background": theme.background,
  "--foreground": theme.foreground,
  "--lead-dark": theme.leadDark,
  "--lead-light": theme.leadLight,
  "--lead-lighter": theme.leadLighter,

  "--muted": theme.muted,
  "--muted-dark": theme.mutedDark,

  "--neutral-emphasis": theme.neutralEmphasis,
  "--neutral-muted": theme.neutralMuted,

  "--dark": theme.dark,
  "--dark-muted": theme.darkMuted,

  "--border": theme.border,
  "--border-muted": theme.borderMuted,

  "--overlay": theme.overlay
} as CSSProperties

const themeAntd = {
  colorPrimary: theme.primary,
  fontFamily: "var(--font-geist-sans), sans-serif",
} as Partial<AliasToken>

export default theme
export { themeBody, themeAntd }