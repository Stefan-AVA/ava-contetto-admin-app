import { dmsans } from "./fonts"

export interface DefaultAvaOrgTheme {
  title: string
  primary: string
  secondary: string
  background: string
  fontFamily: string
  description: string
}

export const initialTheme = {
  title: "#172832",
  primary: "#303F65",
  secondary: "#B80E7F",
  background: "#FFF",
  fontFamily: dmsans.style.fontFamily,
  description: "#8C8C8C",
} satisfies DefaultAvaOrgTheme
