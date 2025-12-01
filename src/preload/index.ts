import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ApplicationSetting } from '../types'

export interface Api {
  loadSettings: () => Promise<ApplicationSetting>
  authorize: (clientId: string) => void
  onSetAuthorizationCode: (callback: (value: string) => void) => void
}

const loadSettings = async () => {
  const result = await ipcRenderer.invoke('app:load-settings')
  if (result) return result
  return {
    stravaClientId: '',
    stravaClientSecret: '',
    maintenanceHours: 120,
    lastMaintenance: ''
  }
}

const authorize = (clientId: string) => {
  const returnURI = 'http://localhost:9000'
  const authURL = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${returnURI}&response_type=code&scope=read,activity:read_all`
  ipcRenderer.send('app:authorize', authURL)
}

const api: Api = {
  loadSettings,
  authorize,
  onSetAuthorizationCode: callback => ipcRenderer.on('set-authorization-code', (_event, value) => callback(value))
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
