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
  CircularProgress,
} from "@mui/material";
import { useAuthStore, useDishStore } from "../store";
import { useNavigate } from "react-router-dom";
import { DishList } from "./DishList";
import { Rankings } from "./Rankings";
import dishes from "../data/dishes.json";
import type { Dish } from "../types";
import { ErrorBoundary } from "./ErrorBoundary";

// Import all images statically
const importImages = async () => {
  const images: Record<string, string> = {};
  const imageModules = import.meta.glob("../assets/dishes/*.jpg", {
    eager: true,
  });

  Object.entries(imageModules).forEach(([path, module]) => {
    const fileName = path.split("/").pop() || "";
    images[fileName] = (module as { default: string }).default;
    console.log(`Loaded image: ${fileName} -> ${images[fileName]}`); // Debug log
  });

  return images;
};

export const DishesPage: React.FC = () => {
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
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

    const loadImagesAndUpdateDishes = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const loadedImages = await importImages();

        if (Object.keys(loadedImages).length === 0) {
          throw new Error("Failed to load dish images");
        }

        setImageUrls(loadedImages);

        const dishesWithImages = dishes.dishes.map((dish) => {
          const fileName = dish.image.split("/").pop() || dish.image;
          return {
            ...dish,
            image:
              loadedImages[fileName] || "/src/assets/dishes/default-dish.jpg",
          };
        });

        setDishes(dishesWithImages);
      } catch (error) {
        console.error("Error loading images:", error);
        setLoadError(
          error instanceof Error ? error.message : "Failed to load dishes"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadImagesAndUpdateDishes();
  }, [currentUser, navigate, setDishes]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: "#ffa726" }} />
        <Typography variant="h6" color="textSecondary">
          Loading dishes...
        </Typography>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: 3,
          backgroundColor: "#fff8e1",
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          Failed to load dishes
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          {loadError}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

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
        <ErrorBoundary>{tab === 0 ? <DishList /> : <Rankings />}</ErrorBoundary>
      </Container>
    </Box>
  );
};
