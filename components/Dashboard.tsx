import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          //navigate("/"); // Redirect to home if no token
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("user", JSON.stringify(data.user)); // Store user info
          return;
        }
        console.log(token);
        const response = await fetch("http://localhost:5000/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const data = await response.json();
        if (!response.ok || !data.user) {
          console.error(
            "User is not logged in:",
            data.error || "Unknown error"
          );
          // navigate("/"); // Redirect to home if not logged in
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        // navigate("/"); // Redirect to home on error
      }
    };

    checkUserSession();
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
