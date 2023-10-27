document.getElementById('random-recipe').addEventListener('click', () => {
    window.api.send('get-random-recipe');
});

window.api.receive('send-random-recipe', (recipe) => {
    console.log("Received in index.js: ", recipe);
    // Map over the relatedData arrays to extract text fields
    const categories = recipe.categories ? recipe.categories.map(c => c.name).join(', ') : 'N/A';
    const ingredients = recipe.ingredients ? recipe.ingredients.map(i => i.name).join(', ') : 'N/A';
    const directions = recipe.directions ? recipe.directions.map(d => d.step).join('<br>') : 'N/A';
    const nutrition = recipe.nutrition ? recipe.nutrition.map(n => `${n.name}: ${n.amount}`).join(', ') : 'N/A';

    const recipePrimaryImage = document.getElementById('recipe-primary-image');
    console.log('Image: ' + recipePrimaryImage)
    if (recipe.image != null) {
      const imagePath = 'recipe_scraping\\' + recipe.image;
      console.log('Checking for file: ' + imagePath);
      // Use the exposed fs API
      if (window.api.fileExists(imagePath)) {
        console.log('Found file: ' + recipe.image);
        // Get the current HTML path
        const htmlPath = window.location.pathname;
        const commonBasePath = htmlPath.substring(0, htmlPath.lastIndexOf('/', htmlPath.lastIndexOf('/') - 1));

        // Now append your known relative path from the JS file to the images
        const imagePath = `${commonBasePath}/recipe_scraping/${recipe.image}`;
        const correctedImagePath = imagePath.replace(/\\/g, '/');
        const newImagePath = commonBasePath.replace('\\src', '');
        recipePrimaryImage.src = `file://${newImagePath}`;

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

