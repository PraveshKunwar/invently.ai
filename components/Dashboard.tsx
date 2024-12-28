import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignOut from "./SignOut";

interface UserSession {
  id: string;
  email: string;
  created_at: string;
  confirmed_at: string | null;
  email_confirmed_at: string | null;
  role: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserSession | null>(null);
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
        console.log(token);
        if (!token) {
          console.error("No token found in localStorage");
          navigate("/");
          return;
        }
        const response = await fetch("http://localhost:5000/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status !== 200) {
          // Token is expired, attempt to refresh
          const refreshResponse = await fetch("http://localhost:5000/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          if (!refreshResponse.ok) {
            console.error("Failed to refresh token");
            navigate("/");
            return;
          }
          const newTokens = await refreshResponse.json();
          localStorage.setItem("access_token", newTokens.access_token);
          localStorage.setItem("refresh_token", newTokens.refresh_token);
          console.log("Token refreshed successfully");
          return; // Retry session check after refreshing token
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error checking user session:", error);
        navigate("/");
      }
    };
    checkUserSession();
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
      {user?.email}
      <SignOut />
    </div>
  );
};

export default Dashboard;
