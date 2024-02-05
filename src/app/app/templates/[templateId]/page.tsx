"use client"

import { startTransition, useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGetOrgsQuery } from "@/redux/apis/org"
import {
  useCreateTemplateMutation,
  useGetTemplateQuery,
  useUpdateTemplateMutation,
} from "@/redux/apis/template"
import { parseError } from "@/utils/error"
import { nameInitials } from "@/utils/format-name"
import masks from "@/utils/masks"
import { LoadingButton } from "@mui/lab"
import {
  Autocomplete,
  Avatar,
  Button,
  Container,
  Divider,
  FormControlLabel,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import {
  Canvas,
  Circle,
  FabricImage,
  Rect,
  Textbox,
  type FabricObject,
} from "fabric"
import { MuiColorInput } from "mui-color-input"
import { useSnackbar } from "notistack"

import { TemplateType } from "@/types/template.types"
import Loading from "@/components/loading"
import { dmsans } from "@/styles/fonts"

import ChooseImage from "./choose-image"
import FabricCanvas from "./fabric-canvas"

interface PageParams {
  params: {
    templateId: string
  }
}

interface Option {
  _id: string
  name: string
}

const initialStyle = {
  fontSize: 16,
  textColor: "#000",
  textAlign: "left",
  lineHeight: 24,
  fontWeight: "400",
  fontFamily: dmsans.style.fontFamily,
  borderColor: "#000",
  backgroundColor: "#000",
}

const initialForm = {
  name: "",
  type: "" as TemplateType,
  price: "",
  orgIds: [] as Option[],
  isPublic: false,
}

export default function Page({ params }: PageParams) {
  const [form, setForm] = useState(initialForm)
  const [style, setStyle] = useState(initialStyle)
  const [canvas, setCanvas] = useState<Canvas[]>([])
  const [currCanvas, setCurrCanvas] = useState(0)
  const [numberOfPages, setNumberOfPages] = useState<number[]>([])
  const [chooseImageModal, setChooseImageModal] = useState(false)
  const [selectedElements, setSelectedElements] = useState<FabricObject[]>([])

  const isCreatePage = params.templateId === "create"

  const { back } = useRouter()

  const { enqueueSnackbar } = useSnackbar()

  const selectedCanvas = canvas[currCanvas]

  const { data: template, isLoading: isLoadingTemplate } = useGetTemplateQuery(
    {
      id: params.templateId,
    },
    {
      skip: isCreatePage || !params.templateId,
    }
  )

  const { data: orgs, isLoading: isLoadingOrgs } = useGetOrgsQuery()

  const [updateTemplate, { isLoading: isLoadingUpdateTemplate }] =
    useUpdateTemplateMutation()

  const [createTemplate, { isLoading: isLoadingCreateTemplate }] =
    useCreateTemplateMutation()

  async function onSubmit() {
    const data = [] as string[]

    canvas.forEach((curr) => data.push(curr.toJSON()))

    const fields = {
      data,
      ...form,
      price: form.price ? masks.clear(form.price) / 100 : 0,
      orgIds: form.orgIds.map(({ _id }) => _id),
    }

    await (
      isCreatePage
        ? createTemplate(fields)
        : updateTemplate({ _id: params.templateId, ...fields })
    )
      .unwrap()
      .then(() => {
        enqueueSnackbar(
          `Template ${isCreatePage ? "created" : "updated"} successfully`,
          { variant: "success" }
        )

        back()
      })
      .catch((error) =>
        enqueueSnackbar(parseError(error), { variant: "error" })
      )
  }

  function onClearAll() {
    for (const object of selectedCanvas.getObjects())
      selectedCanvas.remove(object)

    selectedCanvas.discardActiveObject()
    selectedCanvas.renderAll()
  }

  function onAddText() {
    const text = new Textbox("Hello world", {
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      lineHeight: style.lineHeight / 16,
      fontFamily: style.fontFamily,
      lockScalingY: true,
    })

    selectedCanvas.add(text)

    selectedCanvas.bringObjectToFront(text)
  }

  function onAddCircle() {
    const circle = new Circle({
      fill: style.backgroundColor,
      stroke: style.borderColor,
      radius: 20,
    })

    selectedCanvas.add(circle)

    selectedCanvas.bringObjectToFront(circle)
  }

  async function onAddImage(fileUrl: string) {
    const image = await FabricImage.fromURL(fileUrl)

    selectedCanvas.add(image)

    selectedCanvas.sendObjectToBack(image)
  }

  function onSendToBack() {
    for (const object of selectedCanvas.getActiveObjects())
      selectedCanvas.sendObjectToBack(object)

    selectedCanvas.discardActiveObject()
    selectedCanvas.renderAll()
  }

  function onAddRectangle() {
    const rect = new Rect({
      fill: style.backgroundColor,
      width: 40,
      stroke: style.borderColor,
      height: 40,
    })

    selectedCanvas.add(rect)

    selectedCanvas.bringObjectToFront(rect)
  }

  function onAddNewPage() {
    setNumberOfPages((prev) => {
      const lastElement = prev[prev.length - 1]

      return [...prev, lastElement + 1]
    })
  }

  const onDeleteElement = useCallback(() => {
    for (const object of selectedCanvas.getActiveObjects())
      selectedCanvas.remove(object)

    selectedCanvas.discardActiveObject()
    selectedCanvas.renderAll()
  }, [selectedCanvas])

  function onUpdateStylesAndCurrentElements(
    key: keyof typeof initialStyle,
    value: string | number
  ) {
    setStyle((prev) => ({ ...prev, [key]: value }))

    if (selectedElements.length > 0) {
      for (const object of selectedElements) {
        if (object.type !== "textbox") {
          if (key === "backgroundColor") object.set({ fill: value })

          if (key === "borderColor") object.set({ stroke: value })
        }

        if (
          object.type === "textbox" &&
          [
            "fontSize",
            "textColor",
            "textAlign",
            "fontFamily",
            "fontWeight",
            "lineHeight",
          ].includes(key)
        ) {
          const customKey = key === "textColor" ? "fill" : key

          const customValue = () => {
            if (customKey === "lineHeight") return Number(value) / 16

            if (customKey === "fontFamily") return `'${value}', sans-serif`

            return value
          }

          object.set({
            [customKey]: customValue(),
          })
        }
      }

      selectedCanvas.renderAll()
    }
  }

  useEffect(() => {
    if (orgs && template && canvas.length > 0) {
      const run = async () => {
        setForm((prev) => ({
          ...prev,
          name: template.name,
          type: template.type,
          price: masks.transformToCurrency(template.price),
          orgIds: orgs.filter(({ _id }) => template.orgIds.includes(_id)),
          isPublic: template.isPublic,
        }))

        const templates = template.data as string[]

        startTransition(() =>
          setNumberOfPages(templates.map((_, index) => index))
        )

        for await (const [key, value] of templates.entries()) {
          const selectedCanvas = canvas[Number(key)]

          await selectedCanvas.loadFromJSON(value)

          selectedCanvas.selection = false

          selectedCanvas.forEachObject((object) => {
            object.hasControls = false
            object.lockRotation = true
            object.lockMovementX = true
            object.lockMovementY = true
          })

          selectedCanvas.renderAll()
        }
      }

      run()

      return
    }

    setNumberOfPages([0])
  }, [orgs, canvas, template])

  // useEffect(() => {
  //   if (!isCreatePage && selectedElements.length > 0) {
  //     for (const object of selectedElements) {
  //       if (object instanceof FabricImage)
  //         object.setSrc(
  //           "https://images.unsplash.com/photo-1605146769289-440113cc3d00"
  //         )
  //     }
  //   }
  // }, [isCreatePage, selectedElements])

  useEffect(() => {
    function keyboard({ key }: KeyboardEvent) {
      if (key === "Escape") selectedCanvas.discardActiveObject()
      if (key === "Backspace" && selectedElements.length <= 0) onDeleteElement()

      selectedCanvas.renderAll()
    }

    document.addEventListener("keydown", keyboard)

    return () => {
      document.removeEventListener("keydown", keyboard)
    }
  }, [selectedCanvas, onDeleteElement, selectedElements])

  if (!isCreatePage && (isLoadingTemplate || isLoadingOrgs)) return <Loading />

  return (
    <Container
      sx={{
        px: { xs: 0, sm: 3 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        sx={{
          mb: 4,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontWeight: "700" }} variant="h4">
          {isCreatePage ? "New Template" : "Edit Template"}
        </Typography>

        {isCreatePage && <Button onClick={onAddNewPage}>Add page</Button>}
      </Stack>

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Nunito+Sans:opsz,wght@6..12,300;6..12,400;6..12,500;6..12,600;6..12,700&family=Open+Sans:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap"
        crossOrigin="anonymous"
      />

      <Stack sx={{ gap: 3, flexDirection: "row" }}>
        <TextField
          value={form.name}
          label="Name"
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, name: target.value }))
          }
          fullWidth
        />

        <TextField
          value={form.price}
          label="Price"
          onChange={({ target }) =>
            setForm((prev) => ({
              ...prev,
              price: masks.currency(target.value),
            }))
          }
          fullWidth
        />

        <TextField
          label="Type"
          value={form.type}
          select
          onChange={({ target }) =>
            setForm((prev) => ({ ...prev, type: target.value as TemplateType }))
          }
          fullWidth
        >
          <MenuItem value="brochure">Brochure</MenuItem>
          <MenuItem value="social">Social</MenuItem>
          <MenuItem value="ads">Ads</MenuItem>
        </TextField>
      </Stack>

      <Stack sx={{ mt: 2, mb: 4, gap: 3, flexDirection: "row" }}>
        <FormControlLabel
          control={
            <Switch
              checked={form.isPublic}
              onChange={({ target }) =>
                setForm((prev) => ({ ...prev, isPublic: target.checked }))
              }
            />
          }
          label="Public"
        />

        {!form.isPublic && (
          <Autocomplete
            value={form.orgIds}
            options={orgs ?? []}
            onChange={(_, newValue) =>
              setForm((prev) => ({ ...prev, orgIds: newValue }))
            }
            multiple
            fullWidth
            clearOnBlur
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Orgs"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      {params.InputProps.endAdornment}
                    </InputAdornment>
                  ),
                }}
              />
            )}
            renderOption={({ key, ...props }: any, option) => (
              <ListItem key={option._id} {...props}>
                <ListItemAvatar>
                  <Avatar alt={option.name}>{nameInitials(option.name)}</Avatar>
                </ListItemAvatar>

                <ListItemText>{option.name}</ListItemText>
              </ListItem>
            )}
            noOptionsText="No Orgs"
            selectOnFocus
            getOptionLabel={(option) => option.name}
            handleHomeEndKeys
          />
        )}
      </Stack>

      <Divider />

      <Stack
        sx={{
          mt: 4,
          mb: 5,
          gap: {
            xs: 1,
            sm: 2,
          },
          flexWrap: "wrap",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Button
          sx={{ whiteSpace: "nowrap" }}
          size="small"
          onClick={onAddText}
          variant="outlined"
        >
          Add text
        </Button>

        <Button
          sx={{ whiteSpace: "nowrap" }}
          size="small"
          variant="outlined"
          onClick={() => setChooseImageModal(true)}
        >
          Add Image
        </Button>

        <Button
          sx={{ whiteSpace: "nowrap" }}
          size="small"
          onClick={onAddCircle}
          variant="outlined"
        >
          Add circle
        </Button>

        <Button
          sx={{ whiteSpace: "nowrap" }}
          size="small"
          onClick={onAddRectangle}
          variant="outlined"
        >
          Add Rectangle
        </Button>

        <Button
          sx={{ whiteSpace: "nowrap" }}
          size="small"
          onClick={onSendToBack}
          variant="outlined"
        >
          Send to back
        </Button>

        <Button
          sx={{ whiteSpace: "nowrap" }}
          size="small"
          onClick={onDeleteElement}
          variant="outlined"
        >
          Delete element
        </Button>

        <Button
          sx={{ whiteSpace: "nowrap" }}
          size="small"
          onClick={onClearAll}
          variant="outlined"
        >
          Clear all
        </Button>
      </Stack>

      <Stack
        sx={{
          mb: 2,
          gap: {
            xs: 1,
            sm: 2,
          },
          flexWrap: "wrap",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <TextField
          label="Font Family"
          value={style.fontFamily}
          select
          onChange={({ target }) =>
            onUpdateStylesAndCurrentElements("fontFamily", target.value)
          }
        >
          <MenuItem value={dmsans.style.fontFamily}>DM Sans</MenuItem>
          <MenuItem value="Inter">Inter</MenuItem>
          <MenuItem value="Roboto">Roboto</MenuItem>
          <MenuItem value="Open Sans">Open Sans</MenuItem>
          <MenuItem value="Plus Jakarta Sans">Plus Jakarta Sans</MenuItem>
          <MenuItem value="Lato">Lato</MenuItem>
          <MenuItem value="Raleway">Raleway</MenuItem>
          <MenuItem value="Nunito Sans">Nunito Sans</MenuItem>
        </TextField>

        <TextField
          label="Font Size"
          value={style.fontSize}
          inputMode="numeric"
          onChange={({ target }) =>
            onUpdateStylesAndCurrentElements(
              "fontSize",
              Number(target.value) ?? initialStyle.fontSize
            )
          }
        />

        <TextField
          label="Line Height"
          value={style.lineHeight}
          inputMode="numeric"
          onChange={({ target }) =>
            onUpdateStylesAndCurrentElements(
              "lineHeight",
              Number(target.value) ?? initialStyle.lineHeight
            )
          }
        />

        <TextField
          label="Font Align"
          value={style.textAlign}
          select
          onChange={({ target }) =>
            onUpdateStylesAndCurrentElements("textAlign", target.value)
          }
        >
          <MenuItem value="left">Left</MenuItem>
          <MenuItem value="center">Center</MenuItem>
          <MenuItem value="right">Right</MenuItem>
        </TextField>

        <TextField
          label="Font Weight"
          value={style.fontWeight}
          select
          onChange={({ target }) =>
            onUpdateStylesAndCurrentElements("fontWeight", target.value)
          }
        >
          <MenuItem value="300">300</MenuItem>
          <MenuItem value="400">400</MenuItem>
          <MenuItem value="500">500</MenuItem>
          <MenuItem value="600">600</MenuItem>
          <MenuItem value="700">700</MenuItem>
        </TextField>
      </Stack>

      <Stack
        sx={{
          mb: 5,
          gap: {
            xs: 1,
            sm: 2,
          },
          flexWrap: "wrap",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <MuiColorInput
          value={style.textColor}
          label="Text Color"
          format="hex"
          onChange={(value) =>
            onUpdateStylesAndCurrentElements("textColor", value)
          }
        />

        <MuiColorInput
          value={style.backgroundColor}
          label="Background Color"
          format="hex"
          onChange={(value) =>
            onUpdateStylesAndCurrentElements("backgroundColor", value)
          }
        />

        <MuiColorInput
          value={style.borderColor}
          label="Border Color"
          format="hex"
          onChange={(value) =>
            onUpdateStylesAndCurrentElements("borderColor", value)
          }
        />
      </Stack>

      <Stack sx={{ gap: 2 }}>
        {numberOfPages.map((page) => (
          <FabricCanvas
            key={page}
            page={page}
            onCanvas={setCanvas}
            currCanvas={currCanvas}
            onCurrCanvas={setCurrCanvas}
            onNumberOfPages={setNumberOfPages}
            onSelectedElements={setSelectedElements}
          />
        ))}
      </Stack>

      <LoadingButton
        sx={{ mt: 8, ml: "auto" }}
        onClick={onSubmit}
        loading={isLoadingCreateTemplate || isLoadingUpdateTemplate}
      >
        Save
      </LoadingButton>

      <ChooseImage
        open={chooseImageModal}
        onClose={() => setChooseImageModal(false)}
        onAddImage={onAddImage}
      />
    </Container>
  )
}
