export const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
  console.error("Please set VITE_PEXELS_API_KEY in your .env file");
  // If you don't have a Pexels API key, you can get one from: https://www.pexels.com/api/
}
