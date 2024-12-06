// Array to store recipes
let recipes = JSON.parse(localStorage.getItem('recipes')) || [];

// DOM Elements
const recipeForm = document.getElementById('recipe-form');
const recipeList = document.getElementById('recipe-list');
const searchBar = document.getElementById('search-bar');

// Load recipes on page load
document.addEventListener('DOMContentLoaded', () => {
    displayRecipes();
});

// Add recipe
recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const ingredients = document.getElementById('ingredients').value.trim();
    const instructions = document.getElementById('instructions').value.trim();
    const imageFile = document.getElementById('image').files[0];

    // Validation
    if (!title || !ingredients || !instructions) {
        alert('All fields are required.');
        return;
    }

    if (imageFile && !imageFile.type.startsWith('image/')) {
        alert('Please upload a valid image.');
        return;
    }

    const recipe = {
        id: Date.now(),
        title,
        ingredients,
        instructions,
        image: imageFile ? URL.createObjectURL(imageFile) : null
    };

    recipes.push(recipe);
    saveRecipes();
    displayRecipes();
    recipeForm.reset();
});

// Display recipes
function displayRecipes(filter = '') {
    recipeList.innerHTML = '';

    const filteredRecipes = recipes.filter(
        (recipe) =>
            recipe.title.toLowerCase().includes(filter.toLowerCase()) ||
            recipe.ingredients.toLowerCase().includes(filter.toLowerCase())
    );

    filteredRecipes.forEach((recipe) => {
        const listItem = document.createElement('li');
        listItem.className = 'recipe-item';
        listItem.innerHTML = `
            <div>
                <h3>${recipe.title}</h3>
                <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                ${
                    recipe.image
                        ? `<img src="${recipe.image}" alt="${recipe.title}" width="100">`
                        : ''
                }
            </div>
            <div>
                <button onclick="editRecipe(${recipe.id})">Edit</button>
                <button onclick="deleteRecipe(${recipe.id})">Delete</button>
            </div>
        `;
        recipeList.appendChild(listItem);
    });
}

// Edit recipe
function editRecipe(id) {
    const recipe = recipes.find((recipe) => recipe.id === id);
    document.getElementById('title').value = recipe.title;
    document.getElementById('ingredients').value = recipe.ingredients;
    document.getElementById('instructions').value = recipe.instructions;

    // Optional: Allow replacing the image
    deleteRecipe(id);
}

// Delete recipe
function deleteRecipe(id) {
    recipes = recipes.filter((recipe) => recipe.id !== id);
    saveRecipes();
    displayRecipes();
}

// Save recipes to localStorage
function saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Search recipes
searchBar.addEventListener('input', (e) => {
    const filter = e.target.value;
    displayRecipes(filter);
});
