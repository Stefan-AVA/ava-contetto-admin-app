"use client"

import { type PropsWithChildren } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3"
import { SnackbarProvider } from "notistack"

import theme from "@/styles/theme"

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <SnackbarProvider
        maxSnack={4}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          {children}
        </LocalizationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}
