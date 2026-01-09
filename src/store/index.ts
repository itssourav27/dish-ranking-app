import { create } from "zustand";
import { Dish, Vote } from "../types";
import users from "../data/users.json";

// Helper functions for localStorage
const loadVotesFromStorage = (): Vote[] => {
  const savedVotes = localStorage.getItem("dishVotes");
  return savedVotes ? JSON.parse(savedVotes) : [];
};

const saveVotesToStorage = (votes: Vote[]) => {
  localStorage.setItem("dishVotes", JSON.stringify(votes));
};

const loadCustomImagesFromStorage = (): { [key: number]: string } => {
  const savedImages = localStorage.getItem("customImages");
  return savedImages ? JSON.parse(savedImages) : {};
};

const saveCustomImagesToStorage = (images: { [key: number]: string }) => {
  localStorage.setItem("customImages", JSON.stringify(images));
};

interface AuthState {
  currentUser: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

interface DishState {
  dishes: Dish[];
  votes: Vote[];
  customImages: { [key: number]: string };
  setDishes: (dishes: Dish[]) => void;
  voteForDish: (dishId: number, rank: number) => void;
  clearVote: (dishId: number) => void;
  getRankings: () => Dish[];
  setCustomImage: (dishId: number, imageUrl: string) => void;
  removeCustomImage: (dishId: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: localStorage.getItem("currentUser"),
  login: (username: string, password: string) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      localStorage.setItem("currentUser", username);
      set({ currentUser: username });
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem("currentUser");
    set({ currentUser: null });
  },
}));

export const useDishStore = create<DishState>((set, get) => ({
  dishes: [],
  votes: loadVotesFromStorage(),
  customImages: loadCustomImagesFromStorage(),
  setDishes: (dishes) => {
    const customImages = get().customImages;
    const dishesWithCustomImages = dishes.map((dish) => ({
      ...dish,
      image: customImages[dish.id] || dish.image,
    }));
    set({ dishes: dishesWithCustomImages });
  },
  setCustomImage: (dishId: number, imageUrl: string) => {
    const state = get();
    const newCustomImages = { ...state.customImages, [dishId]: imageUrl };

    // Update dishes with new custom image
    const updatedDishes = state.dishes.map((dish) =>
      dish.id === dishId ? { ...dish, image: imageUrl } : dish
    );

    set({ customImages: newCustomImages, dishes: updatedDishes });
    saveCustomImagesToStorage(newCustomImages);
  },
  removeCustomImage: (dishId: number) => {
    const state = get();
    const { [dishId]: removed, ...newCustomImages } = state.customImages;

    // Reset dish to original image
    const updatedDishes = state.dishes.map((dish) =>
      dish.id === dishId
        ? { ...dish, image: dish.customImage || dish.image }
        : dish
    );

    set({ customImages: newCustomImages, dishes: updatedDishes });
    saveCustomImagesToStorage(newCustomImages);
  },
  voteForDish: (dishId, rank) => {
    const state = get();
    const userId = useAuthStore.getState().currentUser;
    if (!userId) return;

    // Remove any existing vote with the same rank by this user
    const votes = state.votes.filter(
      (v) => !(v.userId === userId && v.rank === rank)
    );

    // Remove any existing vote for this dish by this user
    const filteredVotes = votes.filter(
      (v) => !(v.userId === userId && v.dishId === dishId)
    );

    // Add the new vote
    const newVotes = [...filteredVotes, { userId, dishId, rank }];

    // Save to state and localStorage
    set({ votes: newVotes });
    saveVotesToStorage(newVotes);
  },
  clearVote: (dishId) => {
    const state = get();
    const userId = useAuthStore.getState().currentUser;
    if (!userId) return;

    const newVotes = state.votes.filter(
      (v) => !(v.userId === userId && v.dishId === dishId)
    );

    // Save to state and localStorage
    set({ votes: newVotes });
    saveVotesToStorage(newVotes);
  },
  getRankings: () => {
    const state = get();
    const pointsMap = new Map<number, number>();

    // Calculate points for each dish
    state.votes.forEach((vote) => {
      const points = vote.rank === 1 ? 30 : vote.rank === 2 ? 20 : 10;
      pointsMap.set(vote.dishId, (pointsMap.get(vote.dishId) || 0) + points);
    });

    // Add points and user's rank to dishes
    const userId = useAuthStore.getState().currentUser;
    return state.dishes
      .map((dish) => ({
        ...dish,
        points: pointsMap.get(dish.id) || 0,
        userRank: state.votes.find(
          (v) => v.userId === userId && v.dishId === dish.id
        )?.rank,
      }))
      .sort((a, b) => (b.points || 0) - (a.points || 0));
  },
}));
