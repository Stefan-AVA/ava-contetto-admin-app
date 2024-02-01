import { createApi } from "@reduxjs/toolkit/query/react"

import type { IUser } from "@/types/user.types"

import { fetchAuthQuery } from "../fetch-auth-query"

export interface IBaseResponse {
  msg: string
}

interface ILoginRequest {
  username: string
  password: string
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchAuthQuery({ baseUrl: "/admin" }),
  endpoints: (builder) => ({
    login: builder.mutation<IUser, ILoginRequest>({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    getMe: builder.query<IUser, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),
  }),
})

export const { useLoginMutation, useGetMeQuery, useLazyGetMeQuery } = authApi
