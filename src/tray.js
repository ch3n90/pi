import { app, Menu, Tray, dialog} from 'electron'
const path = require('path')

let focusedWindow;
// tray
let appIcon;
const initTray = () => {
    const iconName = process.platform === 'win32' ? 'icon.png' : 'icon.png'
    const iconPath = path.join(__static, iconName)
    if (!appIcon || appIcon.isDestroyed()) {
        appIcon = new Tray(iconPath);
        let menuItems = [
            {
                label: 'About',
                click: () => {
                    console.log(process.platform)
                    const options = {
                        type: 'info',
                        title: 'About',
                        icon: iconPath,
                        detail:"Version: 1.2.0 \n" +
                                "Date: 2021-01-01 \n" +
                                "Electron: 11.0.4 \n",
                        message: " π (Pi) ",
                        buttons: ['Yes']
                    }
                    dialog.showMessageBox(focusedWindow,options);
                }
            },
            {
                label: 'Exit',
                click: () => {
                    appIcon.destroy()
                    app.exit();
                }
            },
        ]
        if(process.platform === "linux" ){
            menuItems.unshift({
                label: 'Dashboard',
                click: () => {
                    focusedWindow.show();
                }
            })
        }
        const contextMenu = Menu.buildFromTemplate(menuItems);
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