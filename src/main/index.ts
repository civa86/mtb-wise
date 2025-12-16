import { app, shell, BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import httpServer from './services/httpServer'
import { ApplicationSetting, AuthData } from '../types'

let mainWindow: BrowserWindow | null = null
let authWindow: BrowserWindow | null = null

const AUTH_DATA = 'auth_data.json'
const APP_SETTINGS = 'app_settings.json'
const APP_WINDOW_WIDTH = 900
const APP_WINDOW_HEIGHT = 620

const getUserDataPath = (name: string) => join(app.getPath('userData'), name)

const readUserData = <T>(name: string) => {
  const userDataPath = getUserDataPath(name)
  let data = {} as T
  if (existsSync(userDataPath)) data = JSON.parse(readFileSync(userDataPath, 'utf-8'))
  return data
}

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: APP_WINDOW_WIDTH,
    minWidth: APP_WINDOW_WIDTH,
    height: APP_WINDOW_HEIGHT,
    minHeight: APP_WINDOW_HEIGHT,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: app.isPackaged ? false : true
    }
  })

  mainWindow.on('ready-to-show', () => {
    if (mainWindow) mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools({ mode: 'detach' })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  try {
    httpServer.start((url: string) => {
      const query = url.split('?')[1]
      if (query) {
        const parsedQuery = Object.fromEntries(new URLSearchParams(query).entries())
        if (parsedQuery.code) {
          if (authWindow) authWindow.close()
          if (mainWindow) {
            mainWindow.webContents.send('set-authorization-code', parsedQuery.code)
            mainWindow.focus()
          }
        }
      }
    })
  } catch (e) {
    app.quit()
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('quit', () => {
  httpServer.stop()
})

ipcMain.handle('app:read-settings', (): ApplicationSetting | null => {
  try {
    const data = readUserData<ApplicationSetting>(APP_SETTINGS)
    return {
      ...data,
      stravaRedirectURI: httpServer.getURL()
    }
  } catch (e) {
    return null
  }
})

ipcMain.handle('app:write-settings', (_event: IpcMainInvokeEvent, settings: ApplicationSetting): boolean => {
  try {
    const userDataPath = getUserDataPath(APP_SETTINGS)
    writeFileSync(userDataPath, JSON.stringify(settings))
    return true
  } catch (e) {
    return false
  }
})

ipcMain.handle('auth:read-data', (): AuthData | null => {
  try {
    const data = readUserData<AuthData>(AUTH_DATA)
    return data
  } catch (e) {
    return null
  }
})

ipcMain.handle('auth:write-data', (_event: IpcMainInvokeEvent, settings: AuthData): boolean => {
  try {
    const userDataPath = getUserDataPath(AUTH_DATA)
    writeFileSync(userDataPath, JSON.stringify(settings))
    return true
  } catch (e) {
    return false
  }
})

ipcMain.on('app:reload', (_event: IpcMainEvent) => {
  if (mainWindow) mainWindow.webContents.reload()
})

ipcMain.on('app:authorize', (_event, value) => {
  authWindow = new BrowserWindow({
    width: 350,
    height: 700,
    show: true,
    autoHideMenuBar: true
  })
  authWindow.webContents.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:70.0) Gecko/20100101 Firefox/70.0'
  authWindow.loadURL(value)
})
