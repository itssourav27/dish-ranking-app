import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useNavigate,
  useRouteError,
  isRouteErrorResponse
} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Login } from "./components/Login";
import { DishesPage } from "./components/DishesPage";
import "./App.css";

function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      bgcolor: "#fff3e0",
      p: 3
    }}>
      <Typography variant="h4" color="error" gutterBottom>
        Oops! Something went wrong
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        {isRouteErrorResponse(error)
          ? `${error.status} ${error.statusText}`
          : 'An unexpected error occurred'}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/')}
        sx={{ mt: 2 }}
      >
        Go back to home
      </Button>
    </Box>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#d84315",
      light: "#ff7543",
      dark: "#9f0000",
    },
    secondary: {
      main: "#ffa726",
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

// Create router with modern Data APIs
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dishes",
    element: <DishesPage />,
    errorElement: <ErrorBoundary />,
  }
]);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={appRouter} />
    </ThemeProvider>
  );
}
