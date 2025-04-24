import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Container,
  Chip,
  Divider,
  Fade,
  InputAdornment,
  IconButton,
  useTheme,
  alpha,
  Tooltip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import MicIcon from "@mui/icons-material/Mic";
import HistoryIcon from "@mui/icons-material/History";
import ClearIcon from "@mui/icons-material/Clear";
import ArticleIcon from "@mui/icons-material/Article";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { searchESGQuery } from "../services/apiService";

// Example suggested queries
const suggestedQueries = [
  "What are our carbon reduction targets?",
  "Explain our diversity policy",
  "How do we handle waste management?",
  "What is our board governance structure?",
  "Outline our sustainable supply chain policies",
];

const QueryInterface = () => {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [queryHistory, setQueryHistory] = useState([]);
  const inputRef = useRef(null);
  const resultRef = useRef(null);

  // Toast notification state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("error");

  // Scroll to result when it's available
  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await searchESGQuery(query);
      setResult(response);

      // Add to query history if not already present
      if (!queryHistory.includes(query)) {
        setQueryHistory((prev) => [query, ...prev].slice(0, 5));
      }
    } catch (err) {
      console.error("Error querying ESG data:", err);
      setError("Failed to get results. Please try again.");

      // Show toast notification for network errors
      if (err.message?.includes("500") || err.response?.status === 500) {
        setToastMessage(
          "Server error (500). The service is currently unavailable. Please try again later."
        );
        setToastSeverity("error");
      } else if (err.message?.includes("network") || !navigator.onLine) {
        setToastMessage(
          "Network error. Please check your internet connection."
        );
        setToastSeverity("warning");
      } else {
        setToastMessage(`Error: ${err.message || "Unknown error occurred"}`);
        setToastSeverity("error");
      }
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuery = (suggestedQuery) => {
    setQuery(suggestedQuery);
    inputRef.current?.focus();
  };

  const handleClearQuery = () => {
    setQuery("");
    setResult(null);
    setError("");
    inputRef.current?.focus();
  };

  // Handle toast close
  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Container
        maxWidth="lg"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Box sx={{ width: "100%" }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 4 },
              borderRadius: 2,
              mt: 2,
              border: 1,
              borderColor: "divider",
              bgcolor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.primary.dark, 0.1)
                  : alpha(theme.palette.primary.light, 0.1),
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="bold"
              >
                ESG Policy Assistant
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                paragraph
                sx={{ mb: 4 }}
              >
                Ask any question about our ESG policies and get accurate answers
                powered by AI.
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 2, mb: 4 }}
              >
                <TextField
                  fullWidth
                  inputRef={inputRef}
                  label=""
                  placeholder="Ask about ESG policies..."
                  variant="outlined"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 0,
                      bgcolor: theme.palette.background.paper,
                      pr: 0.5,
                      pl: 2,
                      py: 1.5,
                      fontSize: "1.3rem",
                    },
                    boxShadow: 2,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {query && (
                          <IconButton
                            aria-label="clear search"
                            onClick={handleClearQuery}
                            edge="end"
                            size="small"
                          >
                            <ClearIcon />
                          </IconButton>
                        )}
                        <Tooltip title="Voice search (coming soon)">
                          <IconButton
                            color="primary"
                            aria-label="voice search"
                            edge="end"
                            disabled
                            sx={{ mx: 1 }}
                          >
                            <MicIcon />
                          </IconButton>
                        </Tooltip>
                        <Button
                          type="submit"
                          variant="contained"
                          disableElevation
                          endIcon={loading ? undefined : <SendIcon />}
                          disabled={loading || !query.trim()}
                          sx={{
                            borderRadius: 6,
                            px: 3,
                            boxShadow: "none",
                            height: 40,
                            ml: 1,
                          }}
                        >
                          {loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Ask"
                          )}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Suggested Queries */}
                {!result && (
                  <Fade in={!result && !loading}>
                    <Box mt={3}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <LightbulbIcon sx={{ mr: 1, fontSize: 18 }} />
                        Suggested Queries
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        {suggestedQueries.map((sq, index) => (
                          <Chip
                            key={index}
                            label={sq}
                            onClick={() => handleSuggestedQuery(sq)}
                            clickable
                            color="primary"
                            variant="outlined"
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Fade>
                )}

                {/* Query History */}
                {queryHistory.length > 0 && (
                  <Fade in={queryHistory.length > 0}>
                    <Box mt={4}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <HistoryIcon sx={{ mr: 1, fontSize: 18 }} />
                        Recent Queries
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        {queryHistory.map((historyItem, index) => (
                          <Chip
                            key={index}
                            label={historyItem}
                            onClick={() => handleSuggestedQuery(historyItem)}
                            clickable
                            size="small"
                            sx={{ m: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Fade>
                )}
              </Box>
            </Box>

            {/* Error Message */}
            {error && (
              <Box sx={{ textAlign: "center", mt: 2, mb: 2 }}>
                <Typography
                  color="error"
                  variant="body2"
                  sx={{
                    p: 2,
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Typography>
              </Box>
            )}

            {/* Loading State */}
            {loading && (
              <Box sx={{ mt: 5, mb: 3, textAlign: "center" }}>
                <CircularProgress />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Analyzing ESG policies...
                </Typography>
              </Box>
            )}

            {/* Result Card */}
            {result && (
              <Fade in={!!result}>
                <Box ref={resultRef} sx={{ mt: 5, mb: 3, mx: "auto" }}>
                  <Divider sx={{ mb: 4 }}>
                    <Chip
                      label="Answer"
                      color="primary"
                      icon={<ArticleIcon />}
                      sx={{ px: 1, fontWeight: 500 }}
                    />
                  </Divider>

                  <Card
                    elevation={0}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      borderWidth: 2,
                      borderColor:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.primary.main, 0.3)
                          : alpha(theme.palette.primary.main, 0.2),
                      overflow: "hidden",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace: "pre-line",
                          lineHeight: 1.7,
                          fontSize: "1.05rem",
                        }}
                      >
                        {result.answer}
                      </Typography>

                      {/* Source Policies */}
                      {result.sourcePolicies &&
                        result.sourcePolicies.length > 0 && (
                          <Box
                            sx={{
                              mt: 3,
                              pt: 3,
                              borderTop: 1,
                              borderColor: "divider",
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Source Policies
                            </Typography>
                            <List dense>
                              {result.sourcePolicies.map((policy, index) => (
                                <ListItem
                                  key={index}
                                  disablePadding
                                  sx={{
                                    py: 0.5,
                                    bgcolor:
                                      index % 2 === 0
                                        ? "transparent"
                                        : alpha(
                                            theme.palette.action.hover,
                                            0.5
                                          ),
                                    borderRadius: 1,
                                    mb: 0.5,
                                  }}
                                >
                                  <ListItemAvatar sx={{ minWidth: 42 }}>
                                    <Avatar
                                      sx={{
                                        width: 30,
                                        height: 30,
                                        bgcolor: alpha(
                                          theme.palette.primary.main,
                                          0.1
                                        ),
                                        color: theme.palette.primary.main,
                                      }}
                                    >
                                      <ArticleIcon fontSize="small" />
                                    </Avatar>
                                  </ListItemAvatar>
                                  <ListItemText
                                    primary={policy.title}
                                    primaryTypographyProps={{
                                      variant: "body2",
                                      fontWeight: 500,
                                    }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}

                      {/* Confidence Score */}
                      {result.confidence && (
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Tooltip title="AI confidence score">
                            <Chip
                              size="small"
                              label={`Confidence: ${Math.round(
                                result.confidence * 100
                              )}%`}
                              color={
                                result.confidence > 0.8
                                  ? "success"
                                  : result.confidence > 0.5
                                  ? "warning"
                                  : "error"
                              }
                              variant="outlined"
                            />
                          </Tooltip>
                        </Box>
                      )}
                    </CardContent>
                  </Card>

                  {/* Ask another question button */}
                  <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleClearQuery}
                      startIcon={<SearchIcon />}
                    >
                      Ask Another Question
                    </Button>
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Toast Notification */}
            <Snackbar
              open={toastOpen}
              autoHideDuration={6000}
              onClose={handleToastClose}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              sx={{
                zIndex: theme.zIndex.snackbar,
                mt: 8, // Add margin top to avoid navbar overlap
                "& .MuiAlert-root": {
                  minWidth: { xs: "90%", sm: 400 },
                  boxShadow: theme.shadows[8],
                  borderRadius: 2,
                },
              }}
            >
              <Alert
                onClose={handleToastClose}
                severity={toastSeverity}
                variant="filled"
                icon={
                  toastSeverity === "error" ? <ErrorOutlineIcon /> : undefined
                }
                sx={{
                  width: "100%",
                  alignItems: "center",
                  "& .MuiAlert-icon": {
                    fontSize: "1.2rem",
                    opacity: 0.9,
                    marginRight: 1,
                  },
                  "& .MuiAlert-message": {
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  },
                  "& .MuiAlert-action": {
                    paddingTop: 0,
                  },
                }}
              >
                {toastMessage}
              </Alert>
            </Snackbar>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default QueryInterface;
