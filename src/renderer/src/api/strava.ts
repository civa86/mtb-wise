import { AxiosError } from 'axios'
// TYPES
import { StravaTokenResponse } from 'src/types'
// UTILS
import { objectToQueryString } from '@renderer/utils'
// API
import { ApiClient } from '@renderer/api/client'

const API_BASE_URL = 'https://www.strava.com'

export const getAuthorizationURL = (clientId: string, redirectURI: string): string =>
  `${API_BASE_URL}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code&scope=read,activity:read_all`

export const getToken = async (clientId: string, clientSecret: string, code: string): Promise<StravaTokenResponse> => {
  try {
    const instance = await ApiClient(API_BASE_URL)
    const payload = {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code'
    }
    const { data } = await instance.post(`api/v3/oauth/token`, payload)
    return data as StravaTokenResponse
  } catch (e) {
    const error = e as AxiosError
    const message = error.message || 'ERROR_GENERIC'
    throw new Error(message)
  }
}

export const fetchActivities = async (page: number, perPage: number, after?: number) => {
  try {
    const query: Record<string, number> = { page, per_page: perPage }
    if (after) query.after = after

    const queryString = objectToQueryString(query)

    const instance = await ApiClient(API_BASE_URL, true)
    const { data } = await instance.get(`/api/v3/athlete/activities?${queryString}`)
    return data
  } catch (e) {
    const error = e as AxiosError
    if (error.response && error.response.status === 401) throw new Error('AUTH_ERROR') //TODO check with a expired token...
    const message = error.message || 'ERROR_GENERIC'
    throw new Error(message)
  }
}

export const refreshToken = async (
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<StravaTokenResponse> => {
  try {
    const instance = await ApiClient(API_BASE_URL)
    const payload = {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }
    const { data } = await instance.post(`api/v3/oauth/token`, payload)
    return data as StravaTokenResponse
  } catch (e) {
    const error = e as AxiosError
    const message = error.message || 'ERROR_GENERIC'
    throw new Error(message)
  }
}
