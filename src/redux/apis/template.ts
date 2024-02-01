import { createApi } from "@reduxjs/toolkit/query/react"

import { ITemplate } from "@/types/template.types"

import { fetchAuthQuery } from "../fetch-auth-query"

export interface IBaseResponse {
  msg: string
}

export const templateApi = createApi({
  reducerPath: "templateApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/admin/templates" }),
  tagTypes: ["Templates"],
  endpoints: (builder) => ({
    createTemplate: builder.mutation<ITemplate, Omit<ITemplate, "_id">>({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Templates"],
    }),
    getTemplates: builder.query<ITemplate[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Templates"],
    }),
    getTemplate: builder.query<ITemplate, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Templates"],
    }),
    updateTemplate: builder.mutation<ITemplate, ITemplate>({
      query: ({ _id, ...rest }) => ({
        url: `/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Templates"],
    }),
    deleteTemplate: builder.mutation<ITemplate, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Templates"],
    }),
  }),
})

export const {
  useCreateTemplateMutation,
  useUpdateTemplateMutation,
  useDeleteTemplateMutation,
  useGetTemplatesQuery,
  useGetTemplateQuery,
} = templateApi
