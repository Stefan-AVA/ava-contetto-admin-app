import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { IUser } from "@/types/user.types"

import { authApi } from "../apis/auth"
import { clearToken } from "../token"

interface IAppState {
  user: IUser | null
}

const initialState: IAppState = {
  user: null,
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = null
      clearToken()
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        state.user = action.payload
      }
    )
  },
})

export const { setUser, logout } = appSlice.actions

export default appSlice.reducer
