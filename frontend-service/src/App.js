import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import QueryInterface from "./components/QueryInterface";
import PolicyList from "./components/PolicyList";
import { ThemeProvider } from "./theme/ThemeProvider";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Navbar />
          <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/query" element={<QueryInterface />} />
              <Route path="/policies" element={<PolicyList />} />
            </Routes>
          </Box>
          <Box
            component="footer"
            sx={{
              py: 3,
              px: 2,
              mt: "auto",
              textAlign: "center",
              bgcolor: "background.paper",
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            ESG Query Platform &copy; {new Date().getFullYear()}
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
