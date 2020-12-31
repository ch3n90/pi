import {
    app,
    ipcMain,
    Menu,
    Tray
} from 'electron'
const path = require('path')

let focusedWindow;

// tray
let appIcon;
const iconName = process.platform === 'win32' ? 'icon.png' : 'icon.png'
const iconPath = path.join(__static, iconName)
ipcMain.on('put-in-tray', (event) => {
    if (!appIcon || appIcon.isDestroyed()) {
        appIcon = new Tray(iconPath)
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '关于',
                click: () => {

                }
            },
            {
                label: '退出',
                click: () => {
                    app.exit();
                }
            },
        ])
        appIcon.on('click', () => {
            focusedWindow.then(win => { win.show() });
        })

        appIcon.setToolTip('π')
        appIcon.setContextMenu(contextMenu)
    }

})

// export this to MenuItem click callback
export const tary = (focusedWindow) => {
    focusedWindow = focusedWindow;
}