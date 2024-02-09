import { createApi } from "@reduxjs/toolkit/query/react"

import { IIndustry } from "@/types/industry.types"

import { fetchAuthQuery } from "../fetch-auth-query"
import { IBaseResponse } from "./template"

export const industryApi = createApi({
  reducerPath: "industryApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/admin/industries" }),
  tagTypes: ["Industries"],
  endpoints: (builder) => ({
    createIndustry: builder.mutation<IIndustry, Omit<IIndustry, "_id">>({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Industries"],
    }),
    getIndustries: builder.query<IIndustry[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Industries"],
    }),
    getIndustry: builder.query<IIndustry, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: ["Industries"],
    }),
    updateIndustry: builder.mutation<IIndustry, IIndustry>({
      query: ({ _id, ...rest }) => ({
        url: `/${_id}`,
        method: "PUT",
        body: rest,
      }),
      invalidatesTags: ["Industries"],
    }),
    deleteIndustry: builder.mutation<IBaseResponse, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Industries"],
    }),
  }),
})

export const {
  useCreateIndustryMutation,
  useGetIndustriesQuery,
  useGetIndustryQuery,
  useUpdateIndustryMutation,
  useDeleteIndustryMutation,
} = industryApi
