"use client"

import { useCallback, useEffect, useState, type PropsWithChildren } from "react"
import {
  Stack,
  Typography,
  useTheme,
  type SxProps,
  type Theme,
} from "@mui/material"
import { useDropzone, type DropzoneOptions } from "react-dropzone"

export interface DragDropProps
  extends Omit<DropzoneOptions, "onDrop" | "onError"> {
  sx?: SxProps<Theme>
  onChange: (files: File[]) => void
  errorText?: string
}

export default function DragAndDrop({
  sx,
  accept,
  onChange,
  multiple,
  children,
  errorText,
}: PropsWithChildren<DragDropProps>) {
  const [error, setError] = useState("")

  const { palette } = useTheme()

  const onDrop = useCallback(
    (files: File[]) => {
      if (files.length > 0) onChange(files)
      else setError("Can't use this type of files!")
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  })

  useEffect(() => {
    if (isDragActive) setError("")
  }, [isDragActive])

  return (
    <Stack
      {...getRootProps()}
      sx={{
        width: "100%",
        cursor: "pointer",
        border: "2px dashed",
        bgcolor: isDragActive ? `${palette.primary.main}20` : "white",
        alignItems: "center",
        borderColor: isDragActive ? "primary.main" : "gray.500",
        borderRadius: 4,
        justifyContent: "center",

        ...sx,
      }}
    >
      <input {...getInputProps()} />

      {errorText ||
        (error && (
          <Typography sx={{ color: "#d73131" }} variant="body2">
            {errorText || error}
          </Typography>
        ))}

      {children}
    </Stack>
  )
}
