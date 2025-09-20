// theme.ts
import {AliasToken} from "antd/es/theme/interface";
import {CSSProperties} from "react";

const theme = {
  primary: "#1D4ED8",
  secondary: "#9333EA",
  background: "#FAFBFC",
  foreground: "#f8f8f8",

  leadDark: '#172b4d',
  leadLight: '#5e6c84'
} as const;

const themeBody = {
  "--primary": theme.primary,
  "--secondary": theme.secondary,
  "--background": theme.background,
  "--foreground": theme.foreground,
  "--lead-dark": theme.leadDark,
  "--lead-light": theme.leadLight,
} as CSSProperties

const themeAntd = {
  colorPrimary: theme.primary,

} as Partial<AliasToken>

export default theme
export { themeBody, themeAntd }