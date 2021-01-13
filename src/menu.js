import { Menu, app } from 'electron'

export function initMenu() {
    // Create the Application's main menu
    const template = [
        {
            label: 'Pi',
            submenu: [{
                role: 'About'
            }]
        },
        {
            label: "Application",
            submenu: [
                { label: "Quit", accelerator: "Command+Q", click: function () { app.quit(); } }
            ]
        },
        {
            label: "Edit",
            submenu: [
                { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu)
}

