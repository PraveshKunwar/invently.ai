import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (accessToken) {
      // Save tokens in localStorage/sessionStorage
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken as string);
      // Redirect to dashboard
      navigate("/dashboard");
    } else {
      // Handle errors or redirect to login
      navigate("/login");
    }
  }, [navigate]);

  return <div>Processing authentication...</div>;
};

export default AuthCallback;