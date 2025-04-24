import React from "react";
import { IconButton, Tooltip, useTheme as useMuiTheme } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "../theme/ThemeProvider";

const ThemeToggle = () => {
  const { mode, toggleTheme } = useTheme();
  const theme = useMuiTheme();

  return (
    <Tooltip
      title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        sx={{
          ml: 1,
          bgcolor: "background.paper",
          color: "text.primary",
          border: `1px solid ${theme.palette.divider}`,
          "&:hover": {
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.04)",
          },
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 2px 6px rgba(0,0,0,0.3)"
              : "0 2px 6px rgba(0,0,0,0.1)",
          transition: theme.transitions.create([
            "background-color",
            "box-shadow",
          ]),
        }}
      >
        {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
