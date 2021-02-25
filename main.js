//BoilerPlate code
const electron = require("electron");
const ejs = require("ejs-electron");

ejs.data({ "Title": "Electron App" })

const app = electron.app;

function createWindow() {
    const win = new electron.BrowserWindow({
        //creates a new window instance
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    })
    win.loadFile('index.ejs').then(function () {
        win.maximize();
        win.webContents.openDevTools();
    })
}
app.whenReady().then(createWindow);

//BoilerPlate ends
