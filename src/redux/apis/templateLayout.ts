import { createApi } from "@reduxjs/toolkit/query/react"

import { ITemplateLayout } from "@/types/template.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import { IBaseResponse } from "./template"

export const templateLayoutApi = createApi({
  reducerPath: "templateLayoutApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/admin/template-layouts" }),
  tagTypes: ["Layouts"],
  endpoints: (builder) => ({
    createTemplateLayout: builder.mutation<
      ITemplateLayout,
      Omit<ITemplateLayout, "_id">
    >({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Layouts"],
    }),
    getTemplateLayouts: builder.query<ITemplateLayout[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Layouts"],
    }),
    getTemplateLayout: builder.query<ITemplateLayout, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Layouts"],
    }),
    updateTemplateLayout: builder.mutation<ITemplateLayout, ITemplateLayout>({
      query: ({ _id, ...rest }) => ({
        url: `/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Layouts"],
    }),
    deleteTemplateLayout: builder.mutation<IBaseResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Layouts"],
    }),
  }),
})

export const {
  useCreateTemplateLayoutMutation,
  useUpdateTemplateLayoutMutation,
  useGetTemplateLayoutsQuery,
  useGetTemplateLayoutQuery,
  useDeleteTemplateLayoutMutation,
} = templateLayoutApi
