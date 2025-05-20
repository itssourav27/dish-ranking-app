import { createClient, Photo } from 'pexels';
import { PEXELS_API_KEY } from "../config/keys";

if (!PEXELS_API_KEY) {
  throw new Error("VITE_PEXELS_API_KEY must be set in .env");
}

const pexels = createClient(PEXELS_API_KEY);

// Specific search terms focused on food photography
const searchTermMap: { [key: string]: string } = {
  "butter chicken": "butter chicken curry food photography",
  "palak paneer": "palak paneer indian curry food",
  "biryani": "chicken biryani rice dish food",
  "dal makhani": "dal makhani black lentils food",
  "chole bhature": "chole bhature food dish",
  "dosa": "masala dosa south indian food",
  "samosa": "samosa indian snack food",
  "gulab jamun": "gulab jamun sweet indian food",
  "tandoori chicken": "tandoori chicken food dish",
  "naan": "naan indian bread food"
};

// Simple function to get a verified image URL
export async function searchImage(query: string): Promise<string> {
  if (!pexels) {
    console.error("Pexels client not initialized - missing API key");
    return getFallbackImage(query);
  }

  try {
    const dishName = query.toLowerCase();
    const searchTerm = searchTermMap[dishName] || `${query} indian food dish`;

    const result = await pexels.photos.search({
      query: searchTerm,
      per_page: 10,
      orientation: "landscape",
      size: "medium"
    });

    if ("error" in result) {
      console.error("Error fetching image from Pexels:", result.error);
      return getFallbackImage(query);
    }

    const photos = result.photos;
    if (photos && photos.length > 0) {
      // Filter for food photos only
      const foodPhotos = photos.filter((photo: Photo) => {
        const alt = (photo.alt || "").toLowerCase();
        // Only include photos that are clearly food/dish related
        const isFoodPhoto = alt.includes("food") || 
                           alt.includes("dish") || 
                           alt.includes("curry") || 
                           alt.includes("meal");
                           
        // Exclude non-food photos
        const isNotFood = alt.includes("person") || 
                         alt.includes("kitchen") || 
                         alt.includes("restaurant") ||
                         alt.includes("cooking") ||
                         alt.includes("chef");

        return isFoodPhoto && !isNotFood;
      });

      if (foodPhotos.length > 0) {
        // Get a random food photo from the filtered results
        const randomIndex = Math.floor(Math.random() * Math.min(3, foodPhotos.length));
        return foodPhotos[randomIndex].src.large;
      }

      // If no food photos found, try the first few results
      const firstFewPhotos = photos.slice(0, 3);
      const randomIndex = Math.floor(Math.random() * firstFewPhotos.length);
      return firstFewPhotos[randomIndex].src.large;
    }

    return getFallbackImage(query);
  } catch (error) {
    console.error("Error fetching image from Pexels:", error);
    return getFallbackImage(query);
  }
}

function getFallbackImage(query: string): string {
  const fallbackImages: { [key: string]: string } = {
    "butter chicken": "https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg",
    default: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
  };
  
  return fallbackImages[query.toLowerCase()] || fallbackImages.default;
}
