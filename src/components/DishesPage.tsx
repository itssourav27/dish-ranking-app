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
import type { Dish } from "../types";
import defaultDish from "../assets/dishes/default-dish.jpg";
import { ErrorBoundary } from "./ErrorBoundary";

// Fetch dishes from public API
const fetchDishes = async (): Promise<Dish[]> => {
  const res = await fetch("/dishes.json");
  if (!res.ok) throw new Error("Failed to fetch dishes");
  const data = (await res.json()) as Dish[];
  return data.map((d) => ({
    ...d,
    image: d.image || defaultDish,
  }));
};

export const DishesPage: React.FC = () => {
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

    const loadDishes = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const apiDishes = await fetchDishes();
        setDishes(apiDishes);
      } catch (error) {
        console.error("Error loading dishes:", error);
        setLoadError(
          error instanceof Error ? error.message : "Failed to load dishes"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDishes();
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
