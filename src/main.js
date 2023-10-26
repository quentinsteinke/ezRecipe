const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('db/recipeInfo.db');

ipcMain.on('get-random-recipe', (event) => {
    db.get("SELECT * FROM recipes ORDER BY RANDOM() LIMIT 1;", [], (err, row) => {
        if (err) {
            return console.log(err.message);
        }
        // send recipe data back to renderer
        event.reply('send-random-recipe', row);
    });
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });

    win.webContents.openDevTools();

    win.loadFile('src/frontend/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    db.close((err) => {
        if (err) {
            console.log(err.message);
        }
        console.log('Close the database connection.');
    });
});
