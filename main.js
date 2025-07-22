const { app, BrowserWindow, ipcMain, desktopCapturer, screen, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const GeminiAPI = require('./gemini');
require('dotenv').config();

let mainWindow;
let chatWindow;
let tray;
let floatingBubble;
let geminiAPI;

function createFloatingBubble() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  floatingBubble = new BrowserWindow({
    width: 60,
    height: 60,
    x: width - 80,
    y: height - 80,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  floatingBubble.loadFile('bubble.html');
  
  // Make the bubble draggable
  floatingBubble.setIgnoreMouseEvents(false);
  
  // Handle bubble click
  floatingBubble.on('closed', () => {
    floatingBubble = null;
  });
}

function createChatWindow() {
  if (chatWindow) {
    chatWindow.focus();
    return;
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  chatWindow = new BrowserWindow({
    width: 400,
    height: 600,
    x: width - 420,
    y: height - 620,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  chatWindow.loadFile('index.html');
  
  chatWindow.once('ready-to-show', () => {
    chatWindow.show();
  });

  chatWindow.on('closed', () => {
    chatWindow = null;
  });

  // Handle blur event to hide window when clicking outside
  chatWindow.on('blur', () => {
    if (chatWindow && !chatWindow.isDestroyed()) {
      chatWindow.hide();
    }
  });
}

function createTray() {
  // Create tray icon
  const iconPath = path.join(__dirname, 'assets', 'icon.png');
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(trayIcon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Assistant',
      click: () => {
        createChatWindow();
      }
    },
    {
      label: 'Toggle Floating Bubble',
      click: () => {
        if (floatingBubble) {
          floatingBubble.close();
        } else {
          createFloatingBubble();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Pilot AI Assistant');
  
  tray.on('click', () => {
    createChatWindow();
  });
}

app.whenReady().then(() => {
  geminiAPI = new GeminiAPI();
  createTray();
  createFloatingBubble();
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createFloatingBubble();
    }
  });
});

app.on('window-all-closed', () => {
  // Keep the app running even when all windows are closed
  // The app can only be quit from the tray
});

app.on('before-quit', () => {
  if (tray) {
    tray.destroy();
  }
});

// IPC handlers
ipcMain.handle('show-chat', () => {
  createChatWindow();
});

ipcMain.handle('close-chat', () => {
  if (chatWindow) {
    chatWindow.close();
  }
});

ipcMain.handle('capture-screen', async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 1920, height: 1080 }
    });
    
    if (sources.length > 0) {
      // Return the thumbnail as base64 data URL
      return sources[0].thumbnail.toDataURL();
    }
    
    throw new Error('No screen sources available');
  } catch (error) {
    console.error('Screen capture error:', error);
    throw error;
  }
});

ipcMain.handle('minimize-to-tray', () => {
  if (chatWindow) {
    chatWindow.hide();
  }
});

ipcMain.handle('send-to-gemini', async (event, prompt, imageData) => {
  try {
    const response = await geminiAPI.generateResponse(prompt, imageData);
    return response;
  } catch (error) {
    console.error('Gemini API error in main process:', error);
    throw error;
  }
});

// Handle app protocol for deep linking (optional)
app.setAsDefaultProtocolClient('pilot-ai');
