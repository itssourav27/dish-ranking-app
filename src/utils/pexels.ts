import { createClient } from "pexels";
import { PEXELS_API_KEY } from "../config/keys";

const pexels = createClient(PEXELS_API_KEY);

export async function searchImage(query: string): Promise<string> {
  try {
    const result = await pexels.photos.search({
      query: `${query} indian food`,
      per_page: 1,
      orientation: "landscape",
    });
    if ("error" in result) {
      console.error("Error fetching image from Pexels:", result.error);
      return `https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg`;
    }

    const photo = result.photos[0];
    return photo
      ? photo.src.large
      : `https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg`;
  } catch (error) {
    console.error("Error fetching image from Pexels:", error);
    return `https://images.pexels.com/photos/placeholder.jpg`;
  }
}
