const fs = require('fs');
const path = require('path');

// Ensure build directory exists
const buildDir = path.join(__dirname, 'dist');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

// Copy assets to build directory
const assetsDir = path.join(__dirname, 'src', 'assets');
const buildAssetsDir = path.join(buildDir, 'assets');

if (!fs.existsSync(buildAssetsDir)) {
    fs.mkdirSync(buildAssetsDir, { recursive: true });
}

// Copy dish images
const dishesDir = path.join(assetsDir, 'dishes');
const buildDishesDir = path.join(buildAssetsDir, 'dishes');

if (!fs.existsSync(buildDishesDir)) {
    fs.mkdirSync(buildDishesDir, { recursive: true });
}

// Copy all jpg files
fs.readdirSync(dishesDir)
    .filter(file => file.endsWith('.jpg'))
    .forEach(file => {
        fs.copyFileSync(
            path.join(dishesDir, file),
            path.join(buildDishesDir, file)
        );
    });

console.log('Build assets copied successfully!');
