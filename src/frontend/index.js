document.getElementById('random-recipe').addEventListener('click', () => {
    window.electron.ipcRenderer.send('get-random-recipe');
});

window.electron.ipcRenderer.on('send-random-recipe', (event, recipe) => {
    // Map over the relatedData arrays to extract text fields
    const categories = recipe.categories ? recipe.categories.map(c => c.name).join(', ') : 'N/A';
    const ingredients = recipe.ingredients ? recipe.ingredients.map(i => i.name).join(', ') : 'N/A';
    const directions = recipe.directions ? recipe.directions.map(d => d.step).join('<br>') : 'N/A';
    const nutrition = recipe.nutrition ? recipe.nutrition.map(n => `${n.name}: ${n.amount}`).join(', ') : 'N/A';

    const recipePrimaryImage = document.getElementById('recipe-primary-image');
    if (recipe.image) {
      const imagePath = '../../recipe_scraper/' + recipe.image;
      // Use the exposed fs API
      if (window.electron.fs.existsSync(imagePath)) {
        recipePrimaryImage.src = imagePath;
      } else {
        console.log('Could not find file: ' + recipe.image);
      }
    } else {
      recipePrimaryImage.src = '../../assets/images/folder.png';
    }

    // Update the HTML content
    const recipeDisplay = document.getElementById('recipe-display');
    recipeDisplay.innerHTML = `
        <h1>${recipe.name}</h1>
        <p>Category: ${categories}</p>
        <p>Nutrition: ${nutrition}</p>
        <p>Ingredients: ${ingredients}</p>
        <p>Directions: ${directions}</p>
        <p>Url: ${recipe.url}</p>
    `;
});

