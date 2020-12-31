'use strict'

import { ipcMain } from 'electron'
const { autoUpdater } = require("electron-updater");

const log = require('electron-log');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = false;

let win;

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  win.webContents.send("update-available", info);
})
autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.');
})
autoUpdater.on('error', (err) => {
  log.info('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  // let log_message = "Download speed: " + progressObj.bytesPerSecond;
  // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  win.webContents.send("update-processbar", progressObj);
})
autoUpdater.on('update-downloaded', (info) => {
  win.webContents.send("update-downloaded");
});

ipcMain.on("agree-update", () => {
  autoUpdater.downloadUpdate();
  win.webContents.send("start-update");
});

ipcMain.on("start-install", () => {
  autoUpdater.quitAndInstall()
});

export const checkForUpdates = (focusedWindow) => {
  win = focusedWindow;
  autoUpdater.checkForUpdates()
}