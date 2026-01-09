import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useDishStore } from "../store";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export const Rankings: React.FC = () => {
  const rankedDishes = useDishStore((state) => state.getRankings());

  const getRankIcon = (index: number) => {
    if (index === 0) {
      return <EmojiEventsIcon sx={{ color: "#FFD700" }} />;
    } else if (index === 1) {
      return <EmojiEventsIcon sx={{ color: "#C0C0C0" }} />;
    } else if (index === 2) {
      return <EmojiEventsIcon sx={{ color: "#CD7F32" }} />;
    }
    return null;
  };
  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "#fff8e1",
        borderRadius: 2,
        boxShadow: 3,
        border: "1px solid #ffa726",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#ffb74d" }}>
            <TableCell sx={{ fontWeight: "bold", color: "#d84315" }}>
              Rank
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#d84315" }}>
              Dish
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#d84315" }}>
              Description
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: "bold", color: "#d84315" }}
            >
              Points
            </TableCell>
            <TableCell
              align="right"
              sx={{ fontWeight: "bold", color: "#d84315" }}
            >
              Your Vote
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rankedDishes.map((dish, index) => (
            <TableRow
              key={dish.id}
              sx={{
                backgroundColor: dish.userRank
                  ? "rgba(255, 167, 38, 0.1)"
                  : "inherit",
                "&:hover": {
                  backgroundColor: "rgba(255, 167, 38, 0.2)",
                },
                transition: "background-color 0.2s",
              }}
            >
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getRankIcon(index)}
                  {index + 1}
                </Box>
              </TableCell>
              <TableCell>{dish.dishName}</TableCell>
              <TableCell>{dish.description}</TableCell>
              <TableCell align="right">{dish.points || 0}</TableCell>
              <TableCell align="right">
                {dish.userRank ? (
                  <Typography color="primary" fontWeight="bold">
                    Rank {dish.userRank}
                  </Typography>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
