import { useState } from "react"
import Image from "next/image"
import {
  useGetTemplateImagesQuery,
  useUploadTemplateImageMutation,
} from "@/redux/apis/templateImage"
import fileToBase64 from "@/utils/file-to-base64"
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab"
import {
  Box,
  Button,
  Unstable_Grid2 as Grid,
  Modal,
  Paper,
  Stack,
  Tab,
  Typography,
} from "@mui/material"
import { CheckCircle2, UploadCloud, X } from "lucide-react"
import { useSnackbar } from "notistack"

import DragAndDrop from "@/components/drag-and-drop"
import Loading from "@/components/loading"

interface ChooseImageProps {
  open: boolean
  onClose: () => void
  onAddImage: (url: string) => void
}

export default function ChooseImage({
  open,
  onClose,
  onAddImage,
}: ChooseImageProps) {
  const [tab, setTab] = useState("1")
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const { enqueueSnackbar } = useSnackbar()

  const { data, isLoading } = useGetTemplateImagesQuery()

  const [uploadImage] = useUploadTemplateImageMutation()

  async function submit() {
    if (tab === "1") {
      if (!selectedImage) {
        enqueueSnackbar("Please select an image from the gallery", {
          variant: "error",
        })

        return
      }

      onAddImage(selectedImage)

      setSelectedImage(null)

      onClose()
    }

    if (tab === "2") {
      if (files.length <= 0) {
        enqueueSnackbar("Please select files to send", { variant: "error" })

        return
      }

      setLoading(true)

      for await (const file of files) {
        const data = {
          name: file.name,
          imageData: await fileToBase64(file),
          imageType: file.type,
        }

        await uploadImage(data)
      }

      setFiles([])

      enqueueSnackbar("Images sent successfully", { variant: "success" })

      setLoading(false)

      setTab("1")
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          p: 4,
          top: "50%",
          left: "50%",
          width: "100%",
          maxWidth: "59rem",
          position: "absolute",
          overflowY: "auto",
          maxHeight: "90vh",
          transform: "translate(-50%, -50%)",
        }}
        variant="outlined"
      >
        <Stack
          sx={{
            mb: 2,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontWeight: 600 }} variant="h4">
            Select a photo
          </Typography>

          <Stack
            sx={{
              color: "white",
              width: "2.5rem",
              height: "2.5rem",
              bgcolor: "gray.300",
              alignItems: "center",
              borderRadius: "50%",
              justifyContent: "center",
            }}
            onClick={() => onClose()}
            component="button"
          >
            <X strokeWidth={3} />
          </Stack>
        </Stack>

        <TabContext value={tab}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={(_, value) => setTab(value)}
              aria-label="lab API tabs example"
            >
              <Tab label="Listing" value="1" />
              <Tab label="Upload new image" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            {isLoading && <Loading />}

            {data && data.length > 0 && (
              <Grid spacing={2} container>
                {data.map(({ _id, url, name }) => (
                  <Grid xs={4} md={3} key={_id}>
                    <Box
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        bgcolor:
                          selectedImage === url ? "primary.main" : "gray.100",
                        borderRadius: 1,
                      }}
                      onClick={() => setSelectedImage(url)}
                    >
                      <Image
                        src={url}
                        alt={name}
                        width={320}
                        height={320}
                        style={{
                          height: "10rem",
                          objectFit: "cover",
                          borderRadius: ".25rem",
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}

            {data && data.length <= 0 && (
              <Typography sx={{ color: "gray.500", textAlign: "center" }}>
                There are no photos registered.
              </Typography>
            )}
          </TabPanel>
          <TabPanel value="2">
            <DragAndDrop onChange={setFiles}>
              <Stack
                sx={{
                  py: 3,
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{ color: "primary.main" }}
                  size={56}
                  component={UploadCloud}
                />

                <Typography
                  sx={{ mt: 1.5, textAlign: "center", fontWeight: "600" }}
                  variant="h6"
                >
                  Drag and drop files here
                </Typography>

                <Typography sx={{ textAlign: "center" }} variant="h6">
                  or
                </Typography>

                <Button sx={{ mt: 1 }} variant="outlined">
                  Upload
                </Button>
              </Stack>
            </DragAndDrop>

            {files.length > 0 && (
              <Stack sx={{ mt: 1.5, gap: 1 }}>
                {files.map((file) => (
                  <Stack
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: "gray.200",
                      alignItems: "center",
                      borderRadius: ".75rem",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                    key={file.name}
                  >
                    <Stack>
                      <Typography
                        sx={{
                          maxWidth: "100%",
                          overflow: "hidden",
                          fontWeight: "600",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                        variant="body2"
                      >
                        {file.name}
                      </Typography>

                      <Typography sx={{ color: "gray.500" }} variant="body2">
                        {(file.size / (1024 * 1024)).toFixed(2)}mb
                      </Typography>
                    </Stack>

                    <Box
                      sx={{ color: "primary.main" }}
                      component={CheckCircle2}
                    />
                  </Stack>
                ))}
              </Stack>
            )}
          </TabPanel>
        </TabContext>

        <LoadingButton
          sx={{ mt: 4, float: "right" }}
          loading={loading}
          onClick={submit}
        >
          {tab === "2" ? "Upload" : "Select photo"}
        </LoadingButton>
      </Paper>
    </Modal>
  )
}
