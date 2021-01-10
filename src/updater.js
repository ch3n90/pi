'use strict'

import { ipcMain } from 'electron'
const { autoUpdater } = require("electron-updater");
const {activeWindow} = require('electron-util');


const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;

let win;

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  if(win === activeWindow()){
    win.webContents.send("update-available", info);
  }
})
autoUpdater.on('update-not-available', (info) => {
  if(win === activeWindow()){
    win.webContents.send("update-not-available", info);
  }
})
autoUpdater.on('error', (err) => {
  log.info('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  if(win === activeWindow()){
    win.webContents.send("update-processbar", progressObj);
  }
})
autoUpdater.on('update-downloaded', (info) => {
  if(win === activeWindow()){
    win.webContents.send("update-downloaded");
  }
});

ipcMain.on("agree-download", () => {
  autoUpdater.downloadUpdate();
});

ipcMain.on("start-install", () => {
  autoUpdater.quitAndInstall()
});

export const checkForUpdates = (focusedWindow) => {
  win = focusedWindow;
  autoUpdater.checkForUpdates()
}