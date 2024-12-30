import React from "react";
import { Button } from "@mui/joy";
import { useNavigate } from "react-router-dom";

const SignOut: React.FC = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("No active session found.");
        navigate("/");
        return;
      }
      const response = await fetch("http://localhost:5000/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      if (response.ok) {
        alert("Logged out successfully!");
      } else {
        alert("An error occurred during logout.");
      }
      navigate("/");
    } catch (error) {
      alert("An unexpected error occurred.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };
  return (
    <div>
      <Button
        onClick={handleSignOut}
        type="button"
        variant="solid"
        sx={{
          width: "100%",
          maxWidth: "200px",
          padding: "0.75rem",
          fontWeight: "bold",
          textTransform: "uppercase",
          backgroundColor: "white",
          color: "black",
          "&:hover": {
            backgroundColor: "white",
          },
        }}
      >
        Sign Out
      </Button>
    </div>
  );
};

export default SignOut;
