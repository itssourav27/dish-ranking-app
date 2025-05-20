import { mkdir, copyFile, readdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function ensureDir(dir) {
    try {
        await access(dir);
    } catch {
        await mkdir(dir, { recursive: true });
    }
}

async function copyAssets() {
    const buildDir = join(__dirname, 'dist');
    const assetsDir = join(__dirname, 'src', 'assets');
    const buildAssetsDir = join(buildDir, 'assets');

if (!fs.existsSync(buildAssetsDir)) {
    fs.mkdirSync(buildAssetsDir, { recursive: true });
}

// Copy dish images
const dishesDir = path.join(assetsDir, 'dishes');
const buildDishesDir = path.join(buildAssetsDir, 'dishes');

try {
    await ensureDir(buildDishesDir);
    
    // Get all jpg files
    const files = await readdir(dishesDir);
    const jpgFiles = files.filter(file => file.endsWith('.jpg'));
    
    // Copy all jpg files
    await Promise.all(jpgFiles.map(file => {
        return copyFile(
            join(dishesDir, file),
            join(buildDishesDir, file)
        );
    }));
    
    console.log('Build assets copied successfully!');
} catch (error) {
    console.error('Error copying assets:', error);
    process.exit(1);
}

// Run the function
copyAssets();
