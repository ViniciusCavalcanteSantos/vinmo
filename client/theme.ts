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

  linkColor: '#1677FF'
} as const;

const themeBody = {
  "--primary": theme.primary,
  "--secondary": theme.secondary,
  "--background": theme.background,
  "--foreground": theme.foreground,
  "--lead-dark": theme.leadDark,
  "--lead-light": theme.leadLight,
  "--lead-lighter": theme.leadLighter,
} as CSSProperties

const themeAntd = {
  colorPrimary: theme.primary,

} as Partial<AliasToken>

export default theme
export { themeBody, themeAntd }