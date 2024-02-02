"use client"

import { useEffect, useRef, type PropsWithChildren } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useLazyGetMeQuery } from "@/redux/apis/auth"
import { logout } from "@/redux/slices/app"
import { useAppDispatch } from "@/redux/store"
import { Box, CircularProgress, Stack } from "@mui/material"

import Sidebar from "./sidebar"

export default function Layout({ children }: PropsWithChildren) {
  const [getme, { isLoading = true }] = useLazyGetMeQuery()

  const initialized = useRef(false)

  const { replace } = useRouter()
  const pathname = usePathname()

  const dispatch = useAppDispatch()

  useEffect(() => {
    async function run() {
      if (!initialized.current) {
        initialized.current = true

        try {
          await getme().unwrap()
        } catch (error) {
          dispatch(logout())
          replace(`/?_next=${pathname}`)
        }
      }
    }

    run()
  }, [dispatch, getme, pathname, replace])

  if (isLoading)
    return (
      <Stack
        sx={{
          width: "100svw",
          height: "100dvh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size="1.25rem" color="inherit" />
      </Stack>
    )

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box component="main" sx={{ width: "100%", p: 3 }}>
        {children}
      </Box>
    </Box>
  )
}
