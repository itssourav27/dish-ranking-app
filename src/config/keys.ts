// Get the API key from environment variables
export const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

// Validate the API key at runtime
if (typeof window !== 'undefined' && !PEXELS_API_KEY) {
  console.error(
    'Please set VITE_PEXELS_API_KEY in your .env file\n' +
    'You can get a key from: https://www.pexels.com/api/'
  );
}
