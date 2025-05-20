const fs = require("fs");
const path = require("path");

async function copyAssets() {
  try {
    // Ensure build directory exists
    const buildDir = path.join(__dirname, "dist");
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }

    // Copy assets to build directory
    const assetsDir = path.join(__dirname, "src", "assets");
    const buildAssetsDir = path.join(buildDir, "assets");
    const dishesDir = path.join(assetsDir, "dishes");
    const buildDishesDir = path.join(buildAssetsDir, "dishes");

    // Ensure all required directories exist
    [buildAssetsDir, buildDishesDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Copy all jpg files
    const files = fs.readdirSync(dishesDir);
    const jpgFiles = files.filter((file) => file.endsWith(".jpg"));

    jpgFiles.forEach((file) => {
      const sourcePath = path.join(dishesDir, file);
      const destPath = path.join(buildDishesDir, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied: ${file}`);
    });

    console.log("Build assets copied successfully!");
  } catch (error) {
    console.error("Error copying assets:", error);
    process.exit(1);
  }
}

// Run the function
copyAssets();
