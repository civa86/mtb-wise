import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from '../stores/auth'

export const ApiClient = async (baseURL: string, authenticated = false): Promise<AxiosInstance> => {
  if (authenticated === true) {
    const headers: Record<string, string> = {}
    const authStore = useAuthStore()
    if (authStore.isAuthFilled && authStore.authData) {
      headers.Authorization = `${authStore.authData.tokenType} ${authStore.authData.accessToken}`
    }
    const instance = axios.create({
      baseURL,
      headers
    })

    return instance
  }

  return axios.create({ baseURL })
}
