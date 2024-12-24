import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
} from "@mui/material";

const SignUpForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(email, password);
  };

  return (
    <div className="home-signup-form">
      <Container
        maxWidth="xs"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Paper
          elevation={4}
          style={{
            padding: "2rem",
            borderRadius: "12px",
            backgroundColor: "#1e1e1e",
            color: "#e0e7ff",
          }}
        >
          <Typography
            variant="h4"
            style={{
              fontWeight: "600",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            Sign Up
          </Typography>
          <Typography
            variant="body1"
            style={{
              marginBottom: "2rem",
              textAlign: "center",
              color: "#b0b7cc",
            }}
          >
            Join Invently.ai for smarter inventory management.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{ style: { color: "#b0b7cc" } }}
                InputProps={{
                  style: {
                    color: "#e0e7ff",
                    backgroundColor: "#2c2c2c",
                    borderRadius: "8px",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "black", // Custom focus outline color
                    },
                  },
                }}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{ style: { color: "#b0b7cc" } }}
                InputProps={{
                  style: {
                    color: "#e0e7ff",
                    backgroundColor: "#2c2c2c",
                    borderRadius: "8px",
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "black", // Custom focus outline color
                    },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                style={{
                  marginTop: "1rem",
                  backgroundColor: "black",
                  color: "#ffffff",
                  fontWeight: "600",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  textTransform: "none",
                }}
              >
                Create Account
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default SignUpForm;
