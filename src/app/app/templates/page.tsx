"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  useDeleteTemplateMutation,
  useGetTemplatesQuery,
} from "@/redux/apis/template"
import masks from "@/utils/masks"
import { Box, Button, CircularProgress, Stack, Typography } from "@mui/material"
import {
  DataGrid,
  GridActionsCellItem,
  GridRowParams,
  type GridColDef,
} from "@mui/x-data-grid"
import { Pencil, Trash } from "lucide-react"

import { ITemplate } from "@/types/template.types"
import Loading from "@/components/loading"

export default function Page() {
  const { push } = useRouter()

  const { data, isLoading } = useGetTemplatesQuery()
  const [deleteTemplate, { isLoading: isLoadingDeleteTemplate }] =
    useDeleteTemplateMutation()

  const columns: GridColDef[] = [
    {
      flex: 1,
      field: "name",
      headerName: "Name",
    },
    {
      width: 200,
      field: "type",
      headerName: "Type",
    },
    {
      type: "number",
      width: 160,
      field: "price",
      headerName: "Price",
      valueFormatter: ({ value }) => masks.transformToCurrency(value),
    },
    {
      type: "boolean",
      width: 100,
      field: "isPublic",
      headerName: "Public",
    },
    {
      type: "actions",
      field: "actions",
      width: 100,
      sortable: false,
      headerName: "",
      filterable: false,
      getActions: (item: GridRowParams<ITemplate>) => [
        <GridActionsCellItem
          key={item.id}
          icon={<Pencil size={20} />}
          label="Editar"
          onClick={() => push(`/app/templates/${item.id}`)}
        />,
        <GridActionsCellItem
          key={item.id}
          icon={
            isLoadingDeleteTemplate ? (
              <CircularProgress size="1rem" color="inherit" />
            ) : (
              <Trash size={20} />
            )
          }
          label="Deletar"
          onClick={() => deleteTemplate({ id: item.id as string })}
        />,
      ],
    },
  ]

  const rows = useMemo(() => {
    if (data)
      return data.map(({ _id, ...rest }) => ({
        id: _id,
        ...rest,
      }))

    return []
  }, [data])

  return (
    <Box>
      <Stack
        sx={{
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontWeight: "700" }} variant="h4">
          Templates
        </Typography>

        <Link href="/app/templates/create">
          <Button>Create</Button>
        </Link>
      </Stack>

      <Stack sx={{ mt: 6 }}>
        {isLoading && <Loading />}

        {data && data.length > 0 && (
          <DataGrid rows={rows} columns={columns} autoHeight />
        )}

        {data && data.length <= 0 && (
          <Typography sx={{ color: "gray.500", textAlign: "center" }}>
            There are no templates registered.
          </Typography>
        )}
      </Stack>
    </Box>
  )
}
