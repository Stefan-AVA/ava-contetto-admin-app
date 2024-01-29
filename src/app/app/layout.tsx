import type { PropsWithChildren } from "react"
import { Box } from "@mui/material"

import Sidebar from "./sidebar"

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  )
}
