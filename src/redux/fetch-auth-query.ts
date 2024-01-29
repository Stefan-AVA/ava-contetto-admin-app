import { FetchBaseQueryArgs } from "@reduxjs/toolkit/dist/query/fetchBaseQuery"
import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  type FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query"

import { getToken, setToken } from "./token"

type FetchQuery = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  FetchBaseQueryMeta
>

export const getBaseQuery = (args: FetchBaseQueryArgs) =>
  fetchBaseQuery({
    baseUrl: args.baseUrl || `${process.env.NEXT_PUBLIC_API_URL}`,
    ...args,
  })

export const fetchAuthQuery =
  (baseArgs?: FetchBaseQueryArgs): FetchQuery =>
  async (args, api, extraOptions) => {
    const token = getToken()

    const params = {
      ...(args as FetchArgs),
      headers: token
        ? {
            ...((args as FetchArgs).headers && (args as FetchArgs).headers),
            Authorization: `Bearer ${token}`,
          }
        : { ...((args as FetchArgs).headers && (args as FetchArgs).headers) },
    }

    const result = await getBaseQuery({
      baseUrl: `${process.env.NEXT_PUBLIC_API_URL}${
        baseArgs?.baseUrl ? baseArgs?.baseUrl : ""
      }`,
    })(params, api, extraOptions)

    if (result.meta?.response?.headers.get("token")) {
      setToken(String(result.meta?.response?.headers.get("token")))
    }

    return result
  }
