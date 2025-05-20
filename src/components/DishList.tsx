import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Theme,
  Container,
  useTheme,
  alpha,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useDishStore } from "../store";

// Add global styles for animations
const globalStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(1.05);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const DishList: React.FC = () => {
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const dishes = useDishStore((state) => state.dishes);
  const votes = useDishStore((state) => state.votes);
  const voteForDish = useDishStore((state) => state.voteForDish);
  const clearVote = useDishStore((state) => state.clearVote);

  const handleRankChange =
    (dishId: number) => (event: SelectChangeEvent<string>) => {
      const value = event.target.value;
      if (value === "") {
        clearVote(dishId);
      } else {
        voteForDish(dishId, parseInt(value));
      }
    };

  const handleImageLoad = (dishId: number) => {
    setLoadingImages((prev) => ({ ...prev, [dishId]: false }));
    setImageErrors((prev) => ({ ...prev, [dishId]: false }));
  };

  const handleImageError = (dishId: number) => {
    setLoadingImages((prev) => ({ ...prev, [dishId]: false }));
    setImageErrors((prev) => ({ ...prev, [dishId]: true }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ px: { xs: 2, md: 4 } }}>
        <Grid
          container
          spacing={{ xs: 2, sm: 3, md: 4 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {dishes.map((dish) => (
            <Grid key={dish.id} xs={4} sm={4} md={3}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-12px)",
                    boxShadow: (theme: Theme) => theme.shadows[12],
                  },
                  backgroundColor: "#fff8e1",
                  border: "2px solid #ffa726",
                  borderRadius: "20px",
                  overflow: "hidden",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: "18px",
                    border: "2px solid transparent",
                    background: "linear-gradient(45deg, #ffa726, #ff7043)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                  },
                  "&:hover::before": {
                    opacity: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    paddingTop: "75%" /* 4:3 aspect ratio */,
                    overflow: "hidden",
                    backgroundColor: "rgba(255, 167, 38, 0.1)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(90deg, transparent, rgba(255, 167, 38, 0.1), transparent)",
                      animation: "shimmer 1.5s infinite",
                      "@keyframes shimmer": {
                        "0%": {
                          transform: "translateX(-100%)",
                        },
                        "100%": {
                          transform: "translateX(100%)",
                        },
                      },
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={dish.image}
                    alt={dish.dishName}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderBottom: "2px solid #ffa726",
                      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "scale(1.08)",
                      },
                      filter: "brightness(1.02) contrast(1.02)",
                      opacity: loadingImages[dish.id] ? 0 : 1,
                    }}
                    onLoad={() => handleImageLoad(dish.id)}
                    onError={() => handleImageError(dish.id)}
                  />
                  {loadingImages[dish.id] && (
                    <CircularProgress
                      size={24}
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                        color: "#ffa726",
                      }}
                    />
                  )}
                  {imageErrors[dish.id] && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        borderRadius: "20px",
                        border: "2px solid #d32f2f",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#d32f2f",
                          fontWeight: "medium",
                          textAlign: "center",
                        }}
                      >
                        Image failed to load
                      </Typography>
                    </Box>
                  )}
                </Box>
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 3,
                    backgroundColor: "#fff8e1",
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#d84315",
                        fontWeight: "bold",
                        fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                        lineHeight: 1.4,
                        mb: 2,                        height: { xs: "2.8rem", sm: "2.8rem", md: "3rem" },
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        textAlign: "center",
                        overflow: "hidden",
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: -8,
                          left: "25%",
                          width: "50%",
                          height: "2px",
                          backgroundColor: "#ffa726",
                          borderRadius: "2px",
                        },
                      }}
                    >
                      {dish.dishName}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#424242",
                        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "0.95rem" },
                        lineHeight: 1.6,
                        minHeight: { xs: "4.8em", sm: "4.8em", md: "4.8em" },
                        maxHeight: { xs: "4.8em", sm: "4.8em", md: "4.8em" },
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        textAlign: "center",
                        padding: "0 8px",
                        marginTop: 1,
                      }}
                    >
                      {dish.description}
                    </Typography>
                  </Box>
                  <FormControl
                    fullWidth
                    size="medium"
                    sx={{
                      mt: "auto",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        transition: "all 0.3s ease",
                        "& fieldset": {
                          borderColor: "#ffa726",
                          borderWidth: 2,
                        },
                        "&:hover fieldset": {
                          borderColor: "#f57c00",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#ef6c00",
                          borderWidth: 2,
                        },
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(255, 167, 38, 0.2)",
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
                      sx={{
                        "& .MuiSelect-select": {
                          py: 1.75,
                          fontWeight: 500,
                          fontSize: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        },
                        "& .MuiMenuItem-root": {
                          fontSize: "1rem",
                        },
                      }}
                    >
                      <MenuItem value="">
                        <Typography sx={{
                          color: "text.secondary",
                          fontSize: "0.95rem",
                          fontStyle: "italic"
                        }}>
                          Select Rank
                        </Typography>
                      </MenuItem>
                      <MenuItem value="1" sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#d84315",
                        fontWeight: "bold",
                      }}>
                        🥇 <span style={{ color: "#d84315" }}>Rank 1</span>
                        <Typography component="span" sx={{ ml: "auto", color: "#666" }}>
                          (30 points)
                        </Typography>
                      </MenuItem>
                      <MenuItem value="2" sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#f57c00",
                        fontWeight: "bold",
                      }}>
                        🥈 <span style={{ color: "#f57c00" }}>Rank 2</span>
                        <Typography component="span" sx={{ ml: "auto", color: "#666" }}>
                          (20 points)
                        </Typography>
                      </MenuItem>
                      <MenuItem value="3" sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "#ff9800",
                        fontWeight: "bold",
                      }}>
                        🥉 <span style={{ color: "#ff9800" }}>Rank 3</span>
                        <Typography component="span" sx={{ ml: "auto", color: "#666" }}>
                          (10 points)
                        </Typography>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};
