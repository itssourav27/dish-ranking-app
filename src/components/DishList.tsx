import React, { useState, useEffect } from "react";
import {
  Grid as MuiGrid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  CircularProgress,
  Theme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDishStore } from "../store";

// Create a styled Grid component that accepts the item prop
const Grid = styled(MuiGrid)(() => ({}));

export const DishList: React.FC = () => {
  const dishes = useDishStore((state) => state.dishes);
  const votes = useDishStore((state) => state.votes);
  const voteForDish = useDishStore((state) => state.voteForDish);
  const clearVote = useDishStore((state) => state.clearVote);

  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>(
    {}
  );
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  // Initialize loading state for each dish
  useEffect(() => {
    if (dishes.length > 0) {
      const initialLoadingState = dishes.reduce((acc, dish) => {
        acc[dish.id] = true;
        return acc;
      }, {} as Record<number, boolean>);
      setLoadingImages(initialLoadingState);
    }
  }, [dishes]);

  const handleImageLoad = (dishId: number) => {
    setLoadingImages((prev) => ({ ...prev, [dishId]: false }));
    setFailedImages((prev) => ({ ...prev, [dishId]: false }));
  };

  const handleImageError = (dishId: number) => {
    setLoadingImages((prev) => ({ ...prev, [dishId]: false }));
    setFailedImages((prev) => ({ ...prev, [dishId]: true }));
  };

  const handleRankChange =
    (dishId: number) => (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      if (value === "") {
        clearVote(dishId);
      } else {
        voteForDish(dishId, parseInt(value));
      }
    };

  return (
    <Grid container spacing={3}>
      {dishes.map((dish) => (
        <Grid key={dish.id} item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: (theme: Theme) => theme.shadows[8],
              },
              backgroundColor: "#fff8e1",
              border: "1px solid #ffa726",
              borderRadius: 2,
            }}
          >
            <Box position="relative" height={250}>
              {loadingImages[dish.id] && (
                <Box
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="100%"
                  height="100%"
                  bgcolor="rgba(255, 248, 225, 0.8)"
                  zIndex={1}
                >
                  <CircularProgress sx={{ color: "#d84315" }} />
                </Box>
              )}
              {failedImages[dish.id] ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height="100%"
                  bgcolor="#fff8e1"
                >
                  <Typography color="error">Failed to load image</Typography>
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  height="250"
                  image={dish.image}
                  alt={dish.dishName}
                  onLoad={() => handleImageLoad(dish.id)}
                  onError={() => handleImageError(dish.id)}
                  sx={{
                    objectFit: "cover",
                    borderBottom: "2px solid #ffa726",
                    filter: loadingImages[dish.id] ? "blur(8px)" : "none",
                    transition: "filter 0.3s ease-in-out",
                  }}
                />
              )}
            </Box>
            <CardContent sx={{ flexGrow: 1, backgroundColor: "#fff8e1" }}>
              <Typography
                gutterBottom
                variant="h6"
                component="h2"
                sx={{
                  color: "#d84315",
                  fontWeight: "bold",
                }}
              >
                {dish.dishName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 2,
                  color: "#424242",
                  fontStyle: "italic",
                }}
              >
                {dish.description}
              </Typography>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ffa726",
                    },
                    "&:hover fieldset": {
                      borderColor: "#f57c00",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#ef6c00",
                    },
                  },
                }}
              >
                <Select
                  value={
                    votes.find((v) => v.dishId === dish.id)?.rank?.toString() ||
                    ""
                  }
                  onChange={handleRankChange(dish.id)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>No rank</em>
                  </MenuItem>
                  <MenuItem value="1">Rank 1 (30 points)</MenuItem>
                  <MenuItem value="2">Rank 2 (20 points)</MenuItem>
                  <MenuItem value="3">Rank 3 (10 points)</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
