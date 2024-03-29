import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux"

import { authApi } from "./apis/auth"
import { industryApi } from "./apis/industry"
import { orgApi } from "./apis/org"
import { templateApi } from "./apis/template"
import { templateImageApi } from "./apis/templateImage"
import { templateLayoutApi } from "./apis/templateLayout"
import appReducer from "./slices/app"

export const store = configureStore({
  reducer: {
    app: appReducer,
    [authApi.reducerPath]: authApi.reducer,
    [orgApi.reducerPath]: orgApi.reducer,
    [templateApi.reducerPath]: templateApi.reducer,
    [templateImageApi.reducerPath]: templateImageApi.reducer,
    [templateLayoutApi.reducerPath]: templateLayoutApi.reducer,
    [industryApi.reducerPath]: industryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      orgApi.middleware,
      templateApi.middleware,
      templateImageApi.middleware,
      templateLayoutApi.middleware,
      industryApi.middleware
    ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch<AppDispatch>
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
