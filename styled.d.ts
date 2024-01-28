import type { PaletteOptions as MUIPaletteOptions } from "@mui/material/styles"

import { palette } from "@/styles/theme"

type Theme = typeof palette

declare module "@mui/material/styles" {
  export interface PaletteOptions extends MUIPaletteOptions, Theme {}
}
