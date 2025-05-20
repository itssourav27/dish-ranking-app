export interface User {
  username: string;
  password: string;
}

export interface Dish {
  id: number;
  dishName: string;
  description: string;
  searchTerm: string;
  image?: string;
  points?: number;
  userRank?: number;
}

export interface Vote {
  userId: string;
  dishId: number;
  rank: number;
}
