import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import QueryInterface from "./QueryInterface";

const Dashboard = () => {
  // Dummy stats for the dashboard
  const stats = [
    // { title: "Total Policies", value: "50" },
    // { title: "Recent Queries", value: "128" },
    // { title: "Response Rate", value: "97%" },
    // { title: "Avg. Response Time", value: "1.2s" },
  ];

  // Dummy recent queries
  const recentQueries = [
    {
      query: "What are our carbon emission targets?",
      timestamp: "2023-06-15T10:30:00",
    },
    {
      query: "How do we manage waste reduction?",
      timestamp: "2023-06-14T14:45:00",
    },
    {
      query: "What is our diversity and inclusion policy?",
      timestamp: "2023-06-13T09:15:00",
    },
    {
      query: "What sustainable materials do we use?",
      timestamp: "2023-06-12T16:20:00",
    },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, px: 2 }}>
      {/* <Typography variant="h4" component="h1" gutterBottom>
        ESG Query Dashboard
      </Typography> */}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={2}
              sx={{ p: 2, textAlign: "center", height: "100%" }}
            >
              <Typography variant="h6" component="div">
                {stat.title}
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{ color: "#1e3a8a", fontWeight: "bold" }}
              >
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container>
        {/* Query Interface */}
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <QueryInterface />
        </Grid>

        {/* Recent Queries */}
        {/* <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Recent Queries
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {recentQueries.map((item, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(item.timestamp).toLocaleString()}
                  </Typography>
                  <Typography variant="body1">{item.query}</Typography>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default Dashboard;
