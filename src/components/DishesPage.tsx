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
    const fetchDishes = async () => {
      try {
        const { dishes } = await import("../data/dishes.json");
        const dishesWithImages = await Promise.all(
          dishes.map(async (dish) => {
            try {
              const { searchImage } = await import("../utils/pexels");
              const imageUrl = await searchImage(dish.searchTerm);
              return { ...dish, image: imageUrl };
            } catch (error) {
              console.error(`Error loading image for ${dish.dishName}:`, error);
              return {
                ...dish,
                image: `https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg`,
              };
            }
          })
        );
        setDishes(dishesWithImages);
      } catch (error) {
        console.error("Error loading dishes:", error);
      }
    };

    fetchDishes();
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
          {" "}
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
        {tab === 0 ? <DishList /> : <Rankings />}
      </Container>
    </Box>
  );
};
