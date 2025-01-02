import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import PricingCards from "./PricingCards";

const Plans: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await fetch("http://localhost:5000/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Authentication failed");
        }

        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error during authentication check:", err);
        setIsAuthenticated(false);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Box sx={{ padding: "2rem", color: "#e0e7ff", textAlign: "center" }}>
      <Typography variant="h4" sx={{ marginBottom: "1.5rem" }}>
        Manage Your Plans
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: "1.5rem" }}>
        Here you will see and manage your subscription plans.
      </Typography>
      <PricingCards />
    </Box>
  );
};

export default Plans;
