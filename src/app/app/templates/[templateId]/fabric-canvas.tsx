"use client"

import {
  useEffect,
  useRef,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react"
import { Box, useMediaQuery } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { Canvas, type CanvasOptions, type FabricObject } from "fabric"
import { Trash } from "lucide-react"

import useWindowSize from "@/hooks/use-window-size"

interface FabricCanvasProps {
  page: number
  onCanvas: Dispatch<SetStateAction<Canvas[]>>
  currCanvas: number
  onHovering: Dispatch<SetStateAction<FabricObject | null>>
  onCurrCanvas: Dispatch<SetStateAction<number>>
  onNumberOfPages: Dispatch<SetStateAction<number[]>>
  onSelectedElements: Dispatch<SetStateAction<FabricObject[]>>
}

export default function FabricCanvas({
  page,
  children,
  onCanvas,
  currCanvas,
  onHovering,
  onCurrCanvas,
  onNumberOfPages,
  onSelectedElements,
}: PropsWithChildren<FabricCanvasProps>) {
  const ref = useRef<HTMLCanvasElement>(null)

  const theme = useTheme()

  const { width } = useWindowSize()

  const matches = useMediaQuery(theme.breakpoints.up("lg"))

  useEffect(() => {
    const options: Partial<CanvasOptions> = {
      width: matches ? 840 : width - 160,
      height: matches ? 1188 : 400,
    }

    const bindEvents = (canvas: Canvas) => {
      canvas.on("mouse:down", () => onHovering(null))
      canvas.on("mouse:over", (e) => onHovering(e.target ?? null))
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

    const currCanvas = new Canvas(ref.current!, options)

    currCanvas.backgroundColor = "#FFF"
    currCanvas.preserveObjectStacking = true

    bindEvents(currCanvas)

    onCanvas((prev) => {
      const findCanvas = prev.find((_, index) => index === page)

      if (findCanvas)
        return prev.map((canvas, index) =>
          index === page ? currCanvas : canvas
        )

      return [...prev, currCanvas]
    })

    return () => {
      currCanvas.dispose()

      onSelectedElements([])
    }
  }, [page, width, matches, onHovering, onCanvas, onSelectedElements])

  function onDeleteCanvas() {
    onCanvas((prev) => prev.filter((_, index) => page !== index))

    onNumberOfPages((prev) => prev.filter((_, index) => page !== index))

    onSelectedElements([])
  }

  return (
    <Box
      sx={{
        width: "fit-content",
        position: "relative",

        ".canvas-container canvas": {
          border: "1px solid",
          borderRadius: ".5rem",
          borderColor: currCanvas === page ? "secondary.main" : "gray.300",
        },
      }}
      onClick={() => onCurrCanvas(page)}
    >
      <canvas id={`canvas-${page}`} ref={ref} />

      {page > 0 && (
        <Box
          sx={{
            py: 3,
            px: 1,
            top: "1rem",
            color: "gray.700",
            right: "-2rem",
            cursor: "pointer",
            bgcolor: "gray.100",
            position: "absolute",
            transition: "all .3s ease-in-out",
            borderTopRightRadius: ".5rem",
            borderBottomRightRadius: ".5rem",

            ":hover": {
              bgcolor: "gray.200",
            },
          }}
          onClick={onDeleteCanvas}
        >
          <Trash size={16} />
        </Box>
      )}

      {children}
    </Box>
  )
}
