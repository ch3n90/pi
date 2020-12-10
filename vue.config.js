module.exports = {
    pages: {
      index: 'src/main.js',
    //   chatpage: 'src/chatpage/main.js'
    },
    lintOnSave:false,
    devServer: {
      disableHostCheck: true,
        proxy: {
          '/rb': {
            target: 'http://192.168.1.118:9090',
            changeOrigin: true,
            pathRewrite:{
                '^/rb':''
            }
          },
          '/ws': {
            target: 'http://192.168.1.118:6767',
            ws: true,
            changeOrigin: true,
            pathRewrite:{
                '^/ws':''
            }
          },
          '/oss': {
            target: 'http://192.168.1.118:9000',
            changeOrigin: true,
            pathRewrite:{
                '^/oss':'/oss'
            }
          }
        }
    },
    pluginOptions:{
      electronBuilder:{
        nodeIntegration: true,
        outputDir: 'build',
        builderOptions: {
          "appId": "com.milchstrabe.rainbow",
          "copyright": "Copyright © 2020 ch3ng",
          "nsis": {
            "oneClick": false,
            "allowElevation": true,
            "allowToChangeInstallationDirectory": true,
            "installerIcon": "build/icons/icon.ico",
            "uninstallerIcon": "build/icons/icon.ico",
            "installerHeaderIcon": "build/icons/icon.ico",
            "createDesktopShortcut": true,
            "createStartMenuShortcut": true,
            "shortcutName": "rainbow"
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
            "icon": "build/icons/icon.icns"
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