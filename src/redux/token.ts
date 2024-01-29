const tokenKey = "@ava-admin-token"

export const setToken = (token: string) => {
  if (window) window.localStorage.setItem(tokenKey, token)
}

export const getToken = (): string | null => {
  if (window) return window.localStorage.getItem(tokenKey)
  return null
}

export const clearToken = () => {
  if (window) window.localStorage.removeItem(tokenKey)
}
