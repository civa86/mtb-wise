import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
  BrowserWindowConstructorOptions
} from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import httpServer from './services/httpServer'
import { Activity, ApplicationSetting, AuthData } from '../types'

let mainWindow: BrowserWindow | null = null
let mainWindowOrig: Array<number> = []
let authWindow: BrowserWindow | null = null
let isHelpOpened = false

const AUTH_DATA = 'auth_data.json'
const APP_SETTINGS = 'app_settings.json'
const APP_ACTIVITIES = 'app_activities.json'
const APP_WINDOW_WIDTH = 840
const APP_WINDOW_HEIGHT = 600

const getUserDataPath = (name: string) => join(app.getPath('userData'), name)

const readUserData = <T>(name: string) => {
  const userDataPath = getUserDataPath(name)
  try {
    if (existsSync(userDataPath)) return JSON.parse(readFileSync(userDataPath, 'utf-8')) as T
    return null
  } catch (e) {
    console.error(e)
    return null
  }
}

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const createSecondaryWindow = (
  uri: string,
  width?: number,
  height?: number,
  sidedWindow?: boolean,
  onClose?: () => void
) => {
  const w = width || APP_WINDOW_WIDTH
  const h = height || APP_WINDOW_HEIGHT
  const opts: BrowserWindowConstructorOptions = {
    width: w,
    height: h,
    show: false,
    autoHideMenuBar: true,
    parent: mainWindow ? mainWindow : undefined,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: app.isPackaged ? false : true
    }
  }
  if (mainWindow) {
    if (sidedWindow) mainWindow.setPosition(mainWindowOrig[0] - APP_WINDOW_WIDTH / 2, mainWindowOrig[1])
    const pos = mainWindow.getPosition()
    opts.x = sidedWindow ? pos[0] + APP_WINDOW_WIDTH + 30 : pos[0] + getRandomInt(15, 400)
    opts.y = sidedWindow ? pos[1] : pos[1] + getRandomInt(15, 200)
  }

  const secondaryWindow = new BrowserWindow(opts)

  secondaryWindow.on('ready-to-show', () => {
    if (secondaryWindow) secondaryWindow.show()
  })

  secondaryWindow.on('close', () => {
    if (mainWindow && sidedWindow) mainWindow.setPosition(mainWindowOrig[0], mainWindowOrig[1])
    if (onClose) onClose()
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    secondaryWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/${uri}`)
  } else {
    secondaryWindow.loadFile(join(__dirname, `../renderer/index.html${uri}`))
  }
}

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: APP_WINDOW_WIDTH,
    minWidth: APP_WINDOW_WIDTH,
    maxWidth: APP_WINDOW_WIDTH,
    height: APP_WINDOW_HEIGHT,
    minHeight: APP_WINDOW_HEIGHT,
    maxHeight: APP_WINDOW_HEIGHT,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: app.isPackaged ? false : true
    }
  })

  mainWindowOrig = mainWindow.getPosition()

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
    console.error(e)
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
    if (!data) return null
    return {
      ...data,
      stravaRedirectURI: httpServer.getURL()
    }
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle('app:write-settings', (_event: IpcMainInvokeEvent, settings: ApplicationSetting): boolean => {
  try {
    const userDataPath = getUserDataPath(APP_SETTINGS)
    writeFileSync(userDataPath, JSON.stringify(settings))
    return true
  } catch (e) {
    console.error(e)
    return false
  }
})

ipcMain.handle('app:read-activities', (): Array<Activity> | null => {
  try {
    const data = readUserData<Array<Activity>>(APP_ACTIVITIES)
    return data
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle('app:write-activities', (_event: IpcMainInvokeEvent, activities: Array<Activity>): boolean => {
  try {
    const userDataPath = getUserDataPath(APP_ACTIVITIES)
    writeFileSync(userDataPath, JSON.stringify(activities))
    return true
  } catch (e) {
    console.error(e)
    return false
  }
})

ipcMain.handle('auth:read-data', (): AuthData | null => {
  try {
    const data = readUserData<AuthData>(AUTH_DATA)
    return data
  } catch (e) {
    console.error(e)
    return null
  }
})

ipcMain.handle('auth:write-data', (_event: IpcMainInvokeEvent, settings: AuthData): boolean => {
  try {
    const userDataPath = getUserDataPath(AUTH_DATA)
    writeFileSync(userDataPath, JSON.stringify(settings))
    return true
  } catch (e) {
    console.error(e)
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

ipcMain.handle('app:show-photos', (_event: IpcMainInvokeEvent, id: string): void =>
  createSecondaryWindow(`#/photos/${id}`)
)

ipcMain.handle('app:show-map', (_event: IpcMainInvokeEvent, id: string): void => createSecondaryWindow(`#/map/${id}`))

ipcMain.handle('app:show-help', (_event: IpcMainInvokeEvent): void => {
  if (!isHelpOpened) {
    createSecondaryWindow(`#/help`, APP_WINDOW_WIDTH / 1.5, APP_WINDOW_HEIGHT, true, () => {
      isHelpOpened = false
    })
    isHelpOpened = true
  }
})
