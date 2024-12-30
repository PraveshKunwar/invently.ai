import React, { useEffect, useState } from "react";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import { Box, Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleRefreshToken = async () => {
    const token = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    try {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Validate the current access token
      const response = await fetch("http://localhost:5000/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate("/dashboard");
      } else if (response.status === 401 && refreshToken) {
        // Refresh the token
        const refreshResponse = await fetch("http://localhost:5000/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshResponse.ok) {
          const newTokens = await refreshResponse.json();
          localStorage.setItem("access_token", newTokens.access_token);
          localStorage.setItem("refresh_token", newTokens.refresh_token);
          setIsAuthenticated(true);
          navigate("/dashboard");
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    handleRefreshToken();
  }, []);

  return (
    <div className="home-page">
      <h1>
        Welcome to invently.ai, your smart AI inventory management system.
      </h1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        {showSignUp ? (
          <>
            <SignUpForm />
            <Typography
              variant="body2"
              sx={{ color: "#b0b7cc", marginTop: -7 }}
            >
              Already have an account?{" "}
              <Link
                onClick={() => setShowSignUp(false)}
                sx={{
                  color: "#4f80ff",
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline", color: "#7faaff" },
                }}
              >
                Sign In
              </Link>
            </Typography>
          </>
        ) : (
          <>
            <SignInForm />
            <Typography
              variant="body2"
              sx={{ color: "#b0b7cc", marginTop: -7 }}
            >
              Don't have an account?{" "}
              <Link
                onClick={() => setShowSignUp(true)}
                sx={{
                  color: "#4f80ff",
                  cursor: "pointer",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline", color: "#7faaff" },
                }}
              >
                Sign Up
              </Link>
            </Typography>
          </>
        )}
      </Box>
    </div>
  );
};

export default Home;
