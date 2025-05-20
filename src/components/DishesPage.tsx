import React, { useEffect, useState } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { useAuthStore, useDishStore } from "../store";
import { useNavigate } from "react-router-dom";
import { DishList } from "./DishList";
import { Rankings } from "./Rankings";
import dishes from "../data/dishes.json";
import type { Dish } from "../types";
import { ErrorBoundary } from './ErrorBoundary';

// Import all images with proper typing
const dishImages = import.meta.glob('../assets/dishes/*.jpg', { 
  eager: true,
  import: 'default'
}) as Record<string, string>;

export const DishesPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const setDishes = useDishStore((state) => state.setDishes);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // Map the dishes with correct image URLs and preload images
    const dishesWithImages = dishes.dishes.map(dish => {
      const imagePath = `/src/assets/dishes/${dish.image}`;
      const imageUrl = dishImages[imagePath] || `/src/assets/dishes/${dish.image}`;
      
      // Pre-load the image
      const img = new Image();
      img.src = imageUrl;
      
      return {
        ...dish,
        image: imageUrl
      };
    });

    setDishes(dishesWithImages);
  }, [currentUser, navigate, setDishes]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dish Ranking App
          </Typography>
          <Typography sx={{ mr: 2 }}>Welcome, {currentUser}!</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tab}
            onChange={(_: React.SyntheticEvent, newValue: number) =>
              setTab(newValue)
            }
          >
            <Tab label="Vote for Dishes" />
            <Tab label="Rankings" />
          </Tabs>
        </Box>
        <ErrorBoundary>
          {tab === 0 ? <DishList /> : <Rankings />}
        </ErrorBoundary>
      </Container>
    </Box>
  );
};
