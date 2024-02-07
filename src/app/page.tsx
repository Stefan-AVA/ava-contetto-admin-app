"use client"

import { useState, type FormEvent } from "react"
import { Route } from "next"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useLoginMutation } from "@/redux/apis/auth"
import { formatErrorZodMessage, parseError } from "@/utils/error"
import { LoadingButton } from "@mui/lab"
import { Box, Stack, TextField, Typography } from "@mui/material"
import ContettoLogo from "~/assets/logo.png"
import Background from "~/assets/signup-background.jpg"
import { z } from "zod"

const schema = z.object({
  username: z.string().min(1, "Enter your username"),
  password: z.string().min(1, "Enter your password"),
})

const initialForm = {
  username: "",
  password: "",
}

export type LoginFormSchema = z.infer<typeof schema>

type FormError = LoginFormSchema & {
  request?: string
}

interface PageProps {
  searchParams: {
    _next: string
  }
}

export default function Auth({ searchParams }: PageProps) {
  const [form, setForm] = useState<LoginFormSchema>(initialForm)
  const [errors, setErrors] = useState<FormError | null>(null)

  const { replace } = useRouter()

  const [login, { isLoading }] = useLoginMutation()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setErrors(null)

    const response = schema.safeParse(form)

    if (!response.success) {
      const error = formatErrorZodMessage<LoginFormSchema>(response.error)

      setErrors(error)

      return
    }

    try {
      const user = await login(response.data).unwrap()

      if (!user.isAdmin) {
        setErrors(
          (prev) =>
            ({
              ...prev,
              request: "You do not have permission to access this platform",
            }) as FormError
        )

        return
      }

      const nextLink = searchParams._next as Route

      replace(nextLink ?? "/app")
    } catch (error) {
      setErrors(
        (prev) => ({ ...prev, request: parseError(error) }) as FormError
      )
    }
  }

  return (
    <Stack
      sx={{
        height: "100%",
        minHeight: "100vh",
        flexDirection: {
          xs: "column",
          md: "row",
        },
      }}
    >
      <Box
        sx={{
          width: {
            xs: "100%",
            md: "50%",
          },
          height: {
            xs: "24rem",
            md: "100%",
          },
          objectFit: "cover",
          minHeight: {
            md: "100vh",
          },
        }}
        src={Background}
        alt=""
        priority
        component={Image}
      />

      <Stack
        sx={{
          px: {
            xs: 3,
            sm: 10,
            lg: 20,
          },
          py: {
            xs: 5,
            sm: 10,
          },
          width: {
            xs: "100%",
            md: "50%",
          },
          height: {
            xs: "100%",
            md: "100vh",
          },
          overflowY: "auto",
          alignItems: "center",
        }}
      >
        <Box
          sx={{ mb: 5, height: "2rem", objectFit: "contain" }}
          src={ContettoLogo}
          alt="Logo Ava"
          component={Image}
        />

        <Typography
          sx={{ mb: 3, color: "gray.700", fontWeight: 700 }}
          variant="h3"
          component="h1"
        >
          Login to your account
        </Typography>

        <Stack sx={{ width: "100%" }} onSubmit={submit} component="form">
          <TextField
            sx={{ mb: 3 }}
            label="Username"
            error={!!errors?.username}
            onChange={({ target }) =>
              setForm((prev) => ({ ...prev, username: target.value }))
            }
            helperText={errors?.username}
          />

          <TextField
            type="password"
            label="Password"
            error={!!errors?.password}
            onChange={({ target }) =>
              setForm((prev) => ({ ...prev, password: target.value }))
            }
            helperText={errors?.password}
          />

          <LoadingButton sx={{ mt: 4.5 }} type="submit" loading={isLoading}>
            Sign In
          </LoadingButton>

          {errors?.request && (
            <Typography
              sx={{ mt: 1.5, color: "red.500", textAlign: "center" }}
              variant="body2"
            >
              {errors.request}
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}
