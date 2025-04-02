const { app, BrowserWindow, protocol } = require('electron/main')
const path = require('node:path')
const isDev = process.env.NODE_ENV === 'development'

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    }
  })

  // Set CSP headers
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' http://localhost:3000;",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
          "style-src 'self' 'unsafe-inline';",
          "img-src 'self' data: https:;",
          "connect-src 'self' http://localhost:3000;"
        ].join(' ')
      }
    });
  });

  if (isDev) {
    win.loadURL('http://localhost:3000')
    win.webContents.openDevTools()
  } else {
    // In production, load the index.html file
    const indexPath = path.join(__dirname, 'out', 'index.html')
    // Ensure file protocol is used
    win.loadFile(indexPath)
  }
}

// Handle file protocol for static assets
app.whenReady().then(() => {
  protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substr(8)
    callback({ path: path.normalize(`${__dirname}/${url}`) })
  })
  
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})






// if (isDev) {
//   mainWindow.loadURL('http://localhost:3000');
//   mainWindow.webContents.openDevTools();
// } else {
//   mainWindow.loadFile(path.join(__dirname, '.next/server/pages/index.html'));
// }