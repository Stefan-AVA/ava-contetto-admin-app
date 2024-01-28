import "@/styles/preflight.css"

import type { PropsWithChildren } from "react"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"

import Providers from "./providers"

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
