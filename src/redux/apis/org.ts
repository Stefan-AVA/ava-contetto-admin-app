import { createApi } from "@reduxjs/toolkit/query/react"

import { IOrg } from "@/types/org.types"

import { fetchAuthQuery } from "../fetch-auth-query"

export const orgApi = createApi({
  reducerPath: "orgApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/admin/orgs" }),
  endpoints: (builder) => ({
    getOrgs: builder.query<IOrg[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
    getOrg: builder.query<IOrg, { id: string }>({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
  }),
})

export const { useGetOrgsQuery, useGetOrgQuery } = orgApi
