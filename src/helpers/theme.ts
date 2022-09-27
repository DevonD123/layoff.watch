import { MantineThemeOverride } from "@mantine/core";

const theme: MantineThemeOverride = {
  colorScheme: "light",
  colors: {
    lightBg: ["#f8f9fa", "#f8f9fa", "#f8f9fa", "#f8f9fa", "#f8f9fa", "#f8f9fa"],
    darkBg: ["#343a40", "#343a40", "#343a40", "#343a40", "#343a40", "#343a40"],
  },
  breakpoints: {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1400,
  },
  // primaryColor: "green",
};

export default theme;
