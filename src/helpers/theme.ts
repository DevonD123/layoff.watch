import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
  palette: {
    background: {
      default: "#DEE7E7",
      paper: "#F4FAFF",
    },
    text: {
      primary: "#293542",
      secondary: "#333",
    },
    primary: {
      main: "#160f29",
    },
    secondary: {
      main: "#246A73",
    },
    info: {
      main: "#368F8B",
    },
    error: {
      main: red.A400,
    },
  },
});

export default theme;
