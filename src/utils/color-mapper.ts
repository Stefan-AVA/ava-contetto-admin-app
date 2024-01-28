import { alpha, getContrastRatio } from "@mui/material/styles"

type ColorMapper = {
  main: string
  dark?: string
  light?: string
}

export default function ({ main, dark, light }: ColorMapper) {
  return {
    main,
    dark: dark ?? alpha(main, 0.9),
    light: light ?? alpha(main, 0.5),
    contrastText: getContrastRatio(main, "#FFF") > 4.5 ? "#FFF" : "#262626",
  }
}
