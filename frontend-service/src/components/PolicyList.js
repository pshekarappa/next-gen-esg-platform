import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getPolicies } from "../services/apiService";

const PolicyList = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const data = await getPolicies();
        setPolicies(data);
        setFilteredPolicies(data);
      } catch (err) {
        console.error("Error fetching policies:", err);
        setError("Failed to load policies. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPolicies(policies);
      return;
    }

    const filtered = policies.filter(
      (policy) =>
        policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPolicies(filtered);
  }, [searchTerm, policies]);

  const handlePolicyClick = (policy) => {
    setSelectedPolicy(policy);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        ESG Policies
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search policies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: "flex", gap: 3 }}>
        <Paper elevation={2} sx={{ width: "40%" }}>
          <List component="nav" aria-label="policies list">
            {filteredPolicies.length === 0 ? (
              <ListItem>
                <ListItemText primary="No policies found" />
              </ListItem>
            ) : (
              filteredPolicies.map((policy, index) => (
                <React.Fragment key={policy.id}>
                  <ListItemButton
                    selected={selectedPolicy?.id === policy.id}
                    onClick={() => handlePolicyClick(policy)}
                  >
                    <ListItemText
                      primary={policy.title}
                      secondary={`Category: ${policy.category}`}
                    />
                  </ListItemButton>
                  {index < filteredPolicies.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
        </Paper>

        <Paper elevation={2} sx={{ width: "60%", p: 3 }}>
          {selectedPolicy ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedPolicy.title}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Category: {selectedPolicy.category}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Last Updated:{" "}
                {new Date(selectedPolicy.lastUpdated).toLocaleDateString()}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1">{selectedPolicy.summary}</Typography>
              {selectedPolicy.keyPoints && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Key Points:</Typography>
                  <List>
                    {selectedPolicy.keyPoints.map((point, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemText primary={point} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Select a policy to view details
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default PolicyList;
