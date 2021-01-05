import { app, Menu, Tray, dialog} from 'electron'
const path = require('path')

let focusedWindow;
// tray
let appIcon;
const initTray = () => {
    let iconName;
    if(process.platform === 'win32'){
        iconName = 'icon.ico';
    }else if(process.platform === 'linux'){
        iconName = 'icon.png';
    }else if(process.platform === "darwin"){
        iconName = 'maciconTemplate.png';
    }else{
        iconName = 'icon.ico';
    }
    const iconPath = path.join(__static, iconName)
    if (!appIcon || appIcon.isDestroyed()) {
        appIcon = new Tray(iconPath);
        let menuItems = [
            {
                label: 'About',
                click: () => {
                    const options = {
                        type: 'info',
                        title: 'About',
                        icon: iconPath,
                        detail:"Version: "+ app.getVersion() +" \n" +
                                "Date: 2021-01-05 \n" +
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
        
        appIcon.setToolTip('π')
        if(process.platform === "linux" || process.platform === 'darwin'){
            appIcon.on("right-click",() => {
                appIcon.popUpContextMenu(contextMenu);
            })
        }else{
            appIcon.setContextMenu(contextMenu)
        }

        appIcon.on('click', () => {
            focusedWindow.show();
            if(process.platform === 'darwin' && !app.dock.isVisible()){
                app.dock.show();
            }
        });
        
    }

}

const focusedWin = (win) => {
    focusedWindow = win;
}

// export this to MenuItem click callback
export { initTray, focusedWin }