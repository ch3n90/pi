import { app, Menu, Tray, dialog} from 'electron'
const path = require('path')

let focusedWindow;
// tray
let appIcon;
const initTray = () => {
    const iconName = process.platform === 'win32' ? 'icon.png' : 'icon.png'
    const iconPath = path.join(__static, iconName)
    if (!appIcon || appIcon.isDestroyed()) {
        appIcon = new Tray(iconPath)
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '关于',
                click: () => {
                    const options = {
                        type: 'info',
                        title: '关于',
                        icon: iconPath,
                        detail:"Version: 1.3.1 \n" +
                                "Date: 2021-01-01 \n" +
                                "Electron: 11.0.4 \n",
                        message: " π (Pi) ",
                        buttons: ['Yes']
                    }
                    dialog.showMessageBox(focusedWindow,options);
                }
            },
            {
                label: '退出',
                click: () => {
                    appIcon.destroy()
                    app.exit();
                }
            },
        ])
        appIcon.on('click', () => {
            focusedWindow.show();
        })

        appIcon.setToolTip('π')
        appIcon.setContextMenu(contextMenu)
    }

}

const focusedWin = (win) => {
    focusedWindow = win;
}

// export this to MenuItem click callback
export { initTray, focusedWin }