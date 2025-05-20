import { create } from "zustand";
import { Dish, Vote } from "../types";
import users from "../data/users.json";

interface AuthState {
  currentUser: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

interface DishState {
  dishes: Dish[];
  votes: Vote[];
  setDishes: (dishes: Dish[]) => void;
  voteForDish: (dishId: number, rank: number) => void;
  clearVote: (dishId: number) => void;
  getRankings: () => Dish[];
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: localStorage.getItem('currentUser'),
  login: (username: string, password: string) => {
    const user = users.users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      localStorage.setItem('currentUser', username);
      set({ currentUser: username });
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem('currentUser');
    set({ currentUser: null });
  },
}));

export const useDishStore = create<DishState>((set, get) => ({
  dishes: [],
  votes: [],
  setDishes: (dishes) => set({ dishes }),
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
    set({
      votes: [...filteredVotes, { userId, dishId, rank }],
    });
  },
  clearVote: (dishId) => {
    const state = get();
    const userId = useAuthStore.getState().currentUser;
    if (!userId) return;

    set({
      votes: state.votes.filter(
        (v) => !(v.userId === userId && v.dishId === dishId)
      ),
    });
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
