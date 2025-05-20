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

// Import all images statically
const importImages = async () => {
  const images: Record<string, string> = {};
  const imageModules = import.meta.glob('/src/assets/dishes/*.jpg', { eager: true });
  
  Object.entries(imageModules).forEach(([path, module]) => {
    const fileName = path.split('/').pop() || '';
    images[fileName] = (module as { default: string }).default;
  });
  
  return images;
};

export const DishesPage: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const setDishes = useDishStore((state) => state.setDishes);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }    // Load images and update dishes
    const loadImagesAndUpdateDishes = async () => {
      const loadedImages = await importImages();
      setImageUrls(loadedImages);
      
      const dishesWithImages = dishes.dishes.map(dish => ({
        ...dish,
        image: loadedImages[dish.image] || '/src/assets/dishes/default-dish.jpg'
      }));
      
      setDishes(dishesWithImages);
    };
    
    loadImagesAndUpdateDishes();

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
