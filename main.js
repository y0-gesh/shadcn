const { app, BrowserWindow, protocol } = require('electron/main')
const path = require('node:path')
const isDev = process.env.NODE_ENV === 'development'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false // Temporarily disable web security to debug asset loading
    }
  })

  // Set CSP headers
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' file: http://localhost:3000;",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
          "style-src 'self' 'unsafe-inline';",
          "img-src 'self' data: file: https:;",
          "font-src 'self' file: data:;",
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
    const startUrl = path.join(__dirname, 'out', 'index.html')
    win.loadURL(`file://${startUrl}`)
    
    // Open DevTools in production for debugging
    win.webContents.openDevTools()
  }
}

// Register file protocol handler
app.whenReady().then(() => {
  // Register protocol handler for file:// URLs
  protocol.interceptFileProtocol('file', (request, callback) => {
    let url = request.url.substr('file://'.length)
    // Handle Windows paths
    url = decodeURIComponent(url)
    try {
      // Resolve the path relative to the app directory
      const resolvedPath = path.resolve(__dirname, url.startsWith('/') ? url.slice(1) : url)
      callback({ path: resolvedPath })
    } catch (error) {
      console.error('Error handling file protocol:', error)
      callback({ error: -2 /* net::FAILED */ })
    }
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