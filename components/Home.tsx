import React, { useState } from "react";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import { Box, Typography, Link } from "@mui/material";

const Home: React.FC = () => {
  const [showSignUp, setShowSignUp] = useState(true);

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
