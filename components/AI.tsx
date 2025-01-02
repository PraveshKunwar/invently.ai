import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";

const AI: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      alert("Please enter something before submitting.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/ai/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userInput }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error("Error submitting query:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "black" }}>
        AI Assistant
      </Typography>
      <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <TextField
          label="Input submission to AI here:"
          variant="outlined"
          fullWidth
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          sx={{
            backgroundColor: "white",
            color: "black",
            "& .MuiInputLabel-root": { color: "black" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "black",
              },
              "&:hover fieldset": {
                borderColor: "black",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            textTransform: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            "&:hover": { backgroundColor: "#0056b3" },
          }}
        >
          Submit
        </Button>
      </Box>
      {response && (
        <Box
          sx={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "black",
            borderRadius: "8px",
            color: "black",
          }}
        >
          <Typography variant="body1">
            <strong>Your Input:</strong> {userInput}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: "1rem" }}>
            <strong>AI Response:</strong> {response}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AI;
