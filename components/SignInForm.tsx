import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ResponseOkData {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (response.ok) {
        const data: ResponseOkData = await response.json();
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        localStorage.setItem("user", data.user as any); // Store user info
        navigate("/dashboard");
      } else {
        const errorData = await response.json();
        console.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="home-signin-form">
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
            Sign In
          </Typography>
          <Typography
            variant="body1"
            style={{
              marginBottom: "2rem",
              textAlign: "center",
              color: "#b0b7cc",
            }}
          >
            Get started at invently.ai by logging in.
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
                Sign In
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};
export default SignInForm;
