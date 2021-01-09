'use strict'

import { app, protocol, BrowserWindow, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { checkForUpdates } from './updater.js'
import { initTray, focusedWin } from './tray.js'
import { initMenu } from './menu.js'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

let piWin
let m3nuWin
let timeoutId;
let updateCheck = true;

global.cache = {
  pi: null,
  token: null,
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createM3nuWindow() {
  // Create the browser window.
  const m3nuWin = new BrowserWindow({
    width: 350,
    height: 650,
    autoHideMenuBar: true,
    resizable: false,
    title: "",
    frame:false,
    titleBarStyle:'hidden',
    center: true,
    show:false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      enableRemoteModule: true,
      devTools: isDevelopment,
      webSecurity: false,
    },
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    m3nuWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) m3nuWin.webContents.openDevTools()

  } else {
    createProtocol('app')
    // Load the index.html when not in development
    m3nuWin.loadURL('app://./index.html')
  }

  m3nuWin.once('ready-to-show', () => {
    m3nuWin.show()
    focusedWin(m3nuWin);
    if(updateCheck){
      updateCheck = false;
      timeoutId = setTimeout(() => {
        checkForUpdates(m3nuWin);
      }, 3000)
    }
  })

  m3nuWin.on("close", (e) => {
    e.preventDefault();
    m3nuWin.hide();
  })

  return m3nuWin;
}

function createPiWindow() {
  // Create the browser window.
  const piWin = new BrowserWindow({
    width: 890,
    height: 700,
    minWidth: 890,
    minHeight: 700,
    autoHideMenuBar: true,
    show: false,
    center: true,
    title: "",
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: false,
      devTools: isDevelopment,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    piWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "pi")
    if (!process.env.IS_TEST) piWin.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    piWin.loadURL('app://./pi.html')
  }

  piWin.once('ready-to-show', () => {
    piWin.show();
    focusedWin(piWin);
  })

  piWin.on("close", (e) => {
    e.preventDefault();
    piWin.hide();
  })

  return piWin;
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    m3nuWin = createM3nuWindow();
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  m3nuWin = createM3nuWindow();
  initTray();
  initMenu();
})


ipcMain.on("pi-win", () => {
  clearTimeout(timeoutId);
  piWin = createPiWindow();
  m3nuWin.destroy();
  m3nuWin = null;
})

ipcMain.on("m3nu-win", () => {
  m3nuWin = createM3nuWindow();
  piWin.destroy();
  piWin = null;
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

