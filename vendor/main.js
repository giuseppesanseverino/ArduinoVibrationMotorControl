const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;

function createWindow() {
  // Determine the correct path to server.js
  const isPackaged = app.isPackaged;
  const unpackedDir = path.join(process.resourcesPath, 'app.asar.unpacked');
  const serverPath = isPackaged 
    ? path.join(unpackedDir, 'server.js')  // Packaged app
    : path.join(__dirname, 'server.js');             // Development

  console.log('Starting server from:', serverPath);

  // Start the Express server
  serverProcess = spawn('node', [serverPath], {
    cwd: isPackaged ? unpackedDir : __dirname,
    stdio: 'pipe',
    env: { 
      ...process.env, 
      IS_PACKAGED: isPackaged ? 'true' : 'false',
      RESOURCES_PATH: process.resourcesPath
    }  
  });

  // Log server output
  serverProcess.stdout.on('data', (data) => {
    console.log('Server stdout:', data.toString());
  });
  serverProcess.stderr.on('data', (data) => {
    console.error('Server stderr:', data.toString());
  });

  // Wait for server to start (increase delay if needed)
  setTimeout(() => {
    console.log('Creating Electron window...');
    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true
      },
      show: false  // Don't show until ready
    });

    // Load the frontend
    mainWindow.loadURL('http://localhost:3000');

    // Error handling for load failures
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load URL:', errorCode, errorDescription);
    });

    mainWindow.webContents.on('did-finish-load', () => {
      console.log('Page loaded successfully');
    });

    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
      console.log('Window shown');
    });

    // Open DevTools in development
    if (!isPackaged) {
      mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
      if (serverProcess) {
        serverProcess.kill();
      }
    });
  }, 3000);  // Increased delay
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});