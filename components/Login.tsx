import React, { useEffect } from "react";
import LoginIcon from "@mui/icons-material/Login";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@mui/joy";

const Login: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data) console.log(data);
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, []);

  const handleLogin = () => {
    window.location.href = "http://127.0.0.1:5000/login";
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "1rem",
      }}
    >
      <Button
        variant="plain"
        onClick={handleLogin}
        endDecorator={<LoginIcon />}
        style={{
          backgroundColor: "white",
          color: "#333",
          border: "2px solid #ddd",
          padding: "10px 20px",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
      >
        Login
      </Button>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
