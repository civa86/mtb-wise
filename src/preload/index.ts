import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ApplicationSetting } from '../types'

export interface Api {
  loadSettings: () => Promise<ApplicationSetting>
}
const api: Api = {
  loadSettings: async () => {
    const result = await ipcRenderer.invoke('app:load-settings')
    if (result) return result
    return {
      stravaClientId: '',
      stravaClientSecret: '',
      maintenanceHours: 120,
      lastMaintenance: ''
    }
  }
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
