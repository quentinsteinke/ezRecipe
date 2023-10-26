const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('db/recipeInfo.db');

ipcMain.on('get-random-recipe', (event) => {
    db.get("SELECT * FROM recipes ORDER BY RANDOM() LIMIT 1;", [], (err, recipe) => {
        if (err) {
            return console.log(err.message);
        }

        // Fetch related data based on recipe ID
        const recipeId = recipe.id;

        const relatedData = {};

        db.all("SELECT * FROM categories WHERE id IN (SELECT category_id FROM recipe_categories WHERE recipe_id = ?)", [recipeId], (err, categories) => {
            relatedData.categories = categories;

            db.all("SELECT * FROM ingredients WHERE id IN (SELECT ingredient_id FROM recipe_ingredients WHERE recipe_id = ?)", [recipeId], (err, ingredients) => {
                relatedData.ingredients = ingredients;

                db.all("SELECT * FROM directions WHERE id IN (SELECT direction_id FROM recipe_directions WHERE recipe_id = ?)", [recipeId], (err, directions) => {
                    relatedData.directions = directions;

                    db.all("SELECT * FROM nutrition WHERE id IN (SELECT nutrition_id FROM recipe_nutrition WHERE recipe_id = ?)", [recipeId], (err, nutrition) => {
                        relatedData.nutrition = nutrition;

                        // Combine recipe and related data, then send to renderer
                        const fullRecipe = {
                            ...recipe,
                            ...relatedData
                        };
                        
                        event.reply('send-random-recipe', fullRecipe);
                    });
                });
            });
        });
    });
});


ipcMain.on('get-recipe-catagory', (event, recipeId) => {
    db.get("SELECT * FROM recipes WHERE id = ?;", [recipeId], (err, row) => {
        if (err) {
            return console.log(err.message);
        }
        // send recipe data back to renderer
        event.reply('send-recipe-catagory', row);
    });
});

console.log(path.join(__dirname, 'preload.js'));

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
    });

    win.webContents.openDevTools();

    win.maximize();

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
