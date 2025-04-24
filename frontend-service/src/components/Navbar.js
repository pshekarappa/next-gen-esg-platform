import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme as useMuiTheme,
  Avatar,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { text: "Dashboard", path: "/dashboard" },
    // { text: "ESG Query", path: "/query" },
    { text: "ESG Policies", path: "/policies" },
    { text: "Update ESG Policies", path: "/update-policies" },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <AutoAwesomeIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          NextGen ESG
        </Typography>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isActive(item.path)}
              sx={{
                textAlign: "center",
                "&.Mui-selected": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.main",
                  },
                },
              }}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <ThemeToggle />
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo & Title */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  display: { xs: "none", md: "flex" },
                  mr: 1.5,
                }}
              >
                <AutoAwesomeIcon />
              </Avatar>
              <Typography
                variant="h6"
                noWrap
                component={Link}
                to="/"
                sx={{
                  mr: 2,
                  fontWeight: 700,
                  color: "text.primary",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                NextGen ESG Platform
              </Typography>
            </Box>

            {/* Mobile menu button */}
            <Box
              sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
            >
              <ThemeToggle />
              <IconButton
                size="large"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 1, color: "text.primary" }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Desktop navigation */}
            <Box
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    mx: 1,
                    color: isActive(item.path)
                      ? "primary.main"
                      : "text.primary",
                    fontWeight: isActive(item.path) ? 700 : 500,
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.04)",
                    },
                    position: "relative",
                    "&::after": isActive(item.path)
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 8,
                          right: 8,
                          height: 3,
                          bgcolor: "primary.main",
                          borderRadius: "3px 3px 0 0",
                        }
                      : {},
                  }}
                >
                  {item.text}
                </Button>
              ))}
              <ThemeToggle />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: 280 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;
