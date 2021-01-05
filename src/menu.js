import { Menu } from 'electron'
  
export function initMenu () {
    // Create the Application's main menu
    const template = [
        {
            label: 'pi',
            submenu: [{
                role: 'About'
            }]
        }
    ]
    
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu)
  }
  
