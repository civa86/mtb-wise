import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import httpServer from './services/httpServer'

let mainWindow: BrowserWindow | null = null
let authWindow: BrowserWindow | null = null

const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
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

ipcMain.handle('app:load-settings', (): string | null => {
  try {
    const userDataPath = app.getPath('userData')
    const userData = join(userDataPath, 'app_settings.json')
    if (existsSync(userData)) return JSON.parse(readFileSync(userData, 'utf-8'))
    else return null
  } catch (e) {
    return null
  }
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
