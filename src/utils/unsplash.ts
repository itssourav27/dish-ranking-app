import { createClient } from "pexels";
import { createApi } from "unsplash-js";
import { PEXELS_API_KEY } from "../config/keys";
import { UNSPLASH_ACCESS_KEY } from "../config/keys";

const pexels = createClient(PEXELS_API_KEY);

const unsplash = createApi({
  accessKey: UNSPLASH_ACCESS_KEY || "",
});

// Map dish names to more specific search terms for better image results
const searchTermMap: { [key: string]: string } = {
  "butter chicken": "authentic indian butter chicken curry dish plated",
  "palak paneer": "authentic indian palak paneer spinach curry dish plated",
  biryani: "authentic indian biryani rice dish plated",
  "dal makhani": "authentic indian dal makhani black lentils dish plated",
  "chole bhature": "authentic indian chole bhature chickpea curry dish plated",
  dosa: "authentic south indian masala dosa plated",
  samosa: "indian samosa snack food plated",
  "gulab jamun": "indian gulab jamun sweet dessert plated",
  "tandoori chicken": "authentic indian tandoori chicken dish plated",
  naan: "fresh indian naan bread plated",
};

export async function searchImage(query: string): Promise<string> {
  try {
    // Use the mapped search term if available, otherwise enhance the original query
    const searchTerm =
      searchTermMap[query.toLowerCase()] ||
      `authentic ${query} indian food dish plated`;

    const result = await unsplash.search.getPhotos({
      query: searchTerm,
      perPage: 5,
      orientation: "landscape",
    });

    if (result.errors) {
      console.error("Error fetching image from Unsplash:", result.errors);
      throw new Error("Unsplash API error");
    }

    const { response } = result;
    if (response && response.results.length > 0) {
      // Try to find relevant images first by checking descriptions
      const relevantPhotos = response.results.filter((photo) => {
        const description = (photo.description || "").toLowerCase();
        const altDescription = (photo.alt_description || "").toLowerCase();

        return (
          description.includes("food") ||
          description.includes("dish") ||
          description.includes("indian") ||
          altDescription.includes("food") ||
          altDescription.includes("dish") ||
          altDescription.includes("indian") ||
          altDescription.includes("cuisine")
        );
      });

      if (relevantPhotos.length > 0) {
        const randomIndex = Math.floor(Math.random() * relevantPhotos.length);
        return relevantPhotos[randomIndex].urls.regular;
      }

      // If no filtered results, use any of the photos
      const randomIndex = Math.floor(Math.random() * response.results.length);
      return response.results[randomIndex].urls.regular;
    }
    throw new Error("No photos found");
  } catch (error) {
    console.error("Error fetching image from Unsplash:", error);
    return `https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800`; // Fallback to a default Indian food image
  }
}
