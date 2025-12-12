import { ipcRenderer } from 'electron'
import { ApplicationSetting, AuthData } from '../types'

export interface Api {
  reload: () => void
  readSettings: () => Promise<ApplicationSetting>
  writeSettings: (settings: Partial<ApplicationSetting>) => Promise<boolean>
  readAuthData: () => Promise<AuthData>
  writeAuthData: (data: AuthData) => Promise<boolean>
  authorize: (authURL: string) => void
  onSetAuthorizationCode: (callback: (code: string) => void) => void
}

const reload = () => ipcRenderer.send('app:reload')

const readSettings = async (): Promise<ApplicationSetting> => {
  const result = await ipcRenderer.invoke('app:read-settings')
  return {
    stravaClientId: result?.stravaClientId || '',
    stravaClientSecret: result?.stravaClientSecret || '',
    stravaRedirectURI: result?.stravaRedirectURI || '',
    maintenanceHours: result?.maintenanceHours || 100,
    lastMaintenance: result?.lastMaintenance || null
  }
}

const writeSettings = async (settings: Partial<ApplicationSetting>) => {
  const result = await ipcRenderer.invoke('app:write-settings', settings)
  return result
}

const readAuthData = async (): Promise<AuthData> => {
  const result = await ipcRenderer.invoke('auth:read-data')
  return {
    accessToken: result?.accessToken || '',
    refreshToken: result?.refreshToken || '',
    tokenType: result?.tokenType || '',
    expiresAt: result?.expiresAt || 0
  }
}

const writeAuthData = async (data: AuthData) => {
  const result = await ipcRenderer.invoke('auth:write-data', data)
  return result
}

const authorize = (authURL: string) => ipcRenderer.send('app:authorize', authURL)

const onSetAuthorizationCode = (callback: (value: string) => void) =>
  ipcRenderer.on('set-authorization-code', (_event, value) => callback(value))

export default {
  reload,
  readSettings,
  writeSettings,
  readAuthData,
  writeAuthData,
  authorize,
  onSetAuthorizationCode
}
