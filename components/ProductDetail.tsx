import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Button,
} from "@mui/material";

interface ProductData {
  id: string;
  name: string;
  description?: string;
  category: string;
  stock_level: number;
  threshold_level: number;
  price: number;
  supplier?: string;
  avatar_url?: string;
  depletion_rate?: number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthenticationAndFetchProduct = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");
        if (!token || !refreshToken) {
          console.error("No valid tokens found. Redirecting to login.");
          navigate("/");
          return;
        }
        const authResponse = await fetch("http://localhost:5000/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!authResponse.ok) {
          const refreshResponse = await fetch("http://localhost:5000/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });
          if (!refreshResponse.ok) {
            console.error("Failed to refresh token. Redirecting to login.");
            navigate("/");
            return;
          }
          const refreshData = await refreshResponse.json();
          localStorage.setItem("access_token", refreshData.access_token);
          localStorage.setItem("refresh_token", refreshData.refresh_token);
          console.log("Token refreshed successfully.");
        }
        const productResponse = await fetch(
          `http://localhost:5000/product/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        if (!productResponse.ok) {
          setError("Product not found");
          return;
        }
        const productData = await productResponse.json();
        setProduct(productData);
      } catch (error) {
        console.error("Error occurred:", error);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    checkAuthenticationAndFetchProduct();
  }, [id, navigate]);

  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
      <Card
        sx={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#1e1e1e",
          color: "#e0e7ff",
          borderRadius: "10px",
          padding: "1rem",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Avatar
            src={product.avatar_url}
            sx={{
              width: 128,
              height: 128,
              fontSize: "1.5rem",
            }}
          >
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#b0b7cc",
              textAlign: "center",
            }}
          >
            {product.category}
          </Typography>
        </CardContent>
        <CardContent>
          <Typography variant="body2" sx={{ marginBottom: "0.5rem" }}>
            {product.description || "No description available"}
          </Typography>
          <Typography variant="body2">
            <strong>Stock Level:</strong> {product.stock_level}
          </Typography>
          <Typography variant="body2">
            <strong>Threshold Level:</strong> {product.threshold_level}
          </Typography>
          <Typography variant="body2">
            <strong>Price:</strong> ${product.price.toFixed(2)}
          </Typography>
          <Typography variant="body2">
            <strong>Depletion Rate:</strong> {product.depletion_rate}
          </Typography>
          {product.supplier && (
            <Typography variant="body2">
              <strong>Supplier:</strong> {product.supplier}
            </Typography>
          )}
        </CardContent>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "black",
              textTransform: "none",
              fontWeight: "bold",
              fontSize: "0.875rem",
              padding: "0.5rem 1rem",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
export default ProductDetail;
