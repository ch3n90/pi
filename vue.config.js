module.exports = {
  pages: {
    index: 'src/main.js',
    pi: 'src/components/pi/main.js'
  },
  lintOnSave: false,

  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      outputDir: 'build',
      builderOptions: {
        "appId": "com.milchstrabe.pi",
        "copyright": "Copyright © 2020-2021 ch3ng",
        "publish": {
          "provider": "s3",
          "bucket": "p-i",
          "endpoint": "http://pi.milchstrabe.com:9000",
          "path": "update"
        },
        "nsis": {
          "oneClick": false,
          "allowElevation": true,
          "allowToChangeInstallationDirectory": true,
          "installerIcon": "build/icons/icon.ico",
          "uninstallerIcon": "build/icons/icon.ico",
          "installerHeaderIcon": "build/icons/icon.ico",
          "createDesktopShortcut": true,
          "createStartMenuShortcut": true,
          "shortcutName": "π"
        },
        "dmg": {
          "contents": [
            {
              "x": 410,
              "y": 150,
              "type": "link",
              "path": "/Applications"
            },
            {
              "x": 130,
              "y": 150,
              "type": "file"
            }
          ]
        },
        "mac": {
          "icon": "build/icons/icon.icns",
          target:[
            'dmg'
          ],
        },
        "win": {
          "icon": "build/icons/icon.ico",
          "target": [
            {
              "target": "nsis",
              "arch": [
                "x64",
                "ia32"
              ]
            }
          ]
        },
        "linux": {
          "icon": "build/icons"
        }

      }
    }
  }
}