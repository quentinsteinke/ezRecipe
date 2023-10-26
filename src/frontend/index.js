document.getElementById('random-recipe').addEventListener('click', () => {
  ipcRenderer.send('get-random-recipe');
});

ipcRenderer.on('send-random-recipe', (event, recipe) => {
  // Assuming recipe is an object with a 'name' and 'category' property
  const recipeDisplay = document.getElementById('recipe-display');
  recipeDisplay.innerHTML = `
    <h1>${recipe.name}</h1>
    <p>Category: ${recipe.category}</p>
    <p>Nutrition: ${recipe.nutrition}</p>
    <p>Ingredients: ${recipe.ingredients}</p>
    <p>Directions: ${recipe.directions}</p>
  `;
});
