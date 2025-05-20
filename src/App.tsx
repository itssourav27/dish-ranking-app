import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Login } from "./components/Login";
import { DishesPage } from "./components/DishesPage";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#d84315", // Deep Orange
      light: "#ff7543",
      dark: "#9f0000",
    },
    secondary: {
      main: "#ffa726", // Orange
      light: "#ffd95b",
      dark: "#c77800",
    },
    background: {
      default: "#fff3e0",
      paper: "#fff8e1",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dishes" element={<DishesPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
