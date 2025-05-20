import React, { useState } from "react";
import {  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (login(username, password)) {
      navigate("/dishes");
    } else {
      setError("Invalid username or password");
    }
  };
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#fff8e1",
            borderRadius: 2,
            border: "1px solid #ffa726",
            width: "100%",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              color: "#d84315",
              fontWeight: "bold",
              mb: 3,
              textAlign: "center",
            }}
          >
            Indian Cuisine
            <Typography
              component="span"
              display="block"
              variant="h6"
              sx={{
                color: "#ef6c00",
                mt: 1,
              }}
            >
              Dish Ranking
            </Typography>
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!error}
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error}
              helperText={error}
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#d84315",
                "&:hover": {
                  backgroundColor: "#bf360c",
                },
                fontSize: "1.1rem",
                padding: "10px",
              }}
            >
              Sign In
            </Button>{" "}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
