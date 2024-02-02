"use client"

import {
  useEffect,
  useMemo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react"
import { Box, Stack, useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { Canvas, type CanvasOptions, type FabricObject } from "fabric"

import useWindowSize from "@/hooks/use-window-size"

interface FabricCanvasProps {
  onCanvas: Dispatch<SetStateAction<Canvas[]>>
  currCanvas: number
  onCurrCanvas: Dispatch<SetStateAction<number>>
  numberOfPages: number
  onSelectedElements: Dispatch<SetStateAction<FabricObject[]>>
}

export default function FabricCanvas({
  onCanvas,
  currCanvas,
  onCurrCanvas,
  numberOfPages,
  onSelectedElements,
}: FabricCanvasProps) {
  const ref = useRef<HTMLCanvasElement[]>([])

  const theme = useTheme()

  const { width } = useWindowSize()

  const matches = useMediaQuery(theme.breakpoints.up("lg"))

  const pages = useMemo(
    () => Array.from(Array(numberOfPages), (_, x) => x),
    [numberOfPages]
  )

  useEffect(() => {
    const options: Partial<CanvasOptions> = {
      width: matches ? 840 : width - 160,
      height: matches ? 1188 : 400,
    }

    const bindEvents = (canvas: Canvas) => {
      canvas.on("selection:cleared", () => {
        onSelectedElements([])
      })
      canvas.on("selection:created", (e) => {
        onSelectedElements(e.selected)
      })
      canvas.on("selection:updated", (e) => {
        onSelectedElements(e.selected)
      })
    }

    const createdCanvas = [] as Canvas[]

    const refs = ref.current && ref.current.length > 0

    if (refs) {
      for (const page of pages) {
        const currRef = ref.current?.[page] as HTMLCanvasElement

        const currCanvas = new Canvas(currRef, options)

        currCanvas.backgroundColor = "#FFF"
        currCanvas.preserveObjectStacking = true

        createdCanvas.push(currCanvas)

        bindEvents(currCanvas)
      }

      onCanvas((prev) => [...prev, ...createdCanvas])
    }
    return () => {
      for (const currCanvas of createdCanvas) currCanvas.dispose()

      onCanvas([])

      onSelectedElements([])
    }
  }, [pages, width, matches, onCanvas, onSelectedElements])

  return (
    <Stack
      sx={{
        gap: 2,

        ".canvas-container canvas": {
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: ".5rem",
        },
      }}
    >
      {pages.map((page) => (
        <Box
          sx={{
            ".canvas-container canvas": {
              borderColor: currCanvas === page ? "secondary.main" : undefined,
            },
          }}
          key={page}
          onClick={() => onCurrCanvas(page)}
        >
          <canvas
            id={`canvas-${page}`}
            ref={(curr) => {
              if (ref.current) ref.current[page] = curr as HTMLCanvasElement
            }}
          />
        </Box>
      ))}
    </Stack>
  )
}
