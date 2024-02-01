import { createApi } from "@reduxjs/toolkit/query/react"

import { ITemplateImage } from "@/types/template.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import { IBaseResponse } from "./template"

interface IUploadImageRequest {
  name: string // file name
  imageData: string // base64 formated image data
  imageType: string // file mimeType - ex: image/jpeg
}

export const templateImageApi = createApi({
  reducerPath: "templateImageApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/admin/template-images" }),
  tagTypes: ["Images"],
  endpoints: (builder) => ({
    uploadTemplateImage: builder.mutation<ITemplateImage, IUploadImageRequest>({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Images"],
    }),
    getTemplateImages: builder.query<ITemplateImage[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Images"],
    }),
    deleteTemplateImage: builder.mutation<IBaseResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Images"],
    }),
  }),
})

export const {
  useUploadTemplateImageMutation,
  useGetTemplateImagesQuery,
  useDeleteTemplateImageMutation,
} = templateImageApi
