import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SignOut from "./SignOut";
import Product from "./Product";
import { Button } from "@mui/joy";

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
  const [isLoading, setIsLoading] = useState(true);
  const handlePlans = () => {
    navigate("/dashboard/plans");
  };
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
        if (!token) {
          setIsLoading(false);
          navigate("/");
          return;
        }
        const response = await fetch("http://localhost:5000/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setUser(data.user);
          setIsLoading(false);
        } else if (response.status === 401 && refreshToken) {
          const refreshResponse = await fetch("http://localhost:5000/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshResponse.ok) {
            const newTokens = await refreshResponse.json();
            localStorage.setItem("access_token", newTokens.access_token);
            localStorage.setItem("refresh_token", newTokens.refresh_token);
            await checkUserSession();
          } else {
            setIsLoading(false);
            navigate("/");
          }
        } else {
          setIsLoading(false);
          navigate("/");
        }
      } catch (error) {
        setIsLoading(false);
        navigate("/");
      }
    };

    if (isLoading) {
      checkUserSession();
    }
  }, [isLoading, navigate]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <h1>Dashboard</h1>
      {user ? (
        <div className="dashboard-data">
          <p>Welcome, {user.email}!</p>
          <SignOut />
          <Button
            onClick={handlePlans}
            type="button"
            variant="solid"
            sx={{
              width: "100%",
              marginTop: "1rem",
              maxWidth: "200px",
              padding: "0.75rem",
              fontWeight: "bold",
              textTransform: "uppercase",
              backgroundColor: "black",
              color: "#EFBF04",
              "&:hover": {
                backgroundColor: "black",
              },
            }}
          >
            Explore Plans
          </Button>
          <Product />
        </div>
      ) : (
        <p>Session not found.</p>
      )}
    </div>
  );
};

export default Dashboard;
