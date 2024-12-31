import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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

const Product: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleViewAnalytics = (id: string) => {
    navigate(`/dashboard/products/${id}`);
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/product", {
          method: "GET",
        });
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch products");
          setLoading(false);
          return;
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError("An error occurred while fetching products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  if (loading) {
    return <div>Loading products...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <Box sx={{ padding: "1rem" }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: "1.5rem", textAlign: "center" }}
      >
        Products
      </Typography>
      <Grid container spacing={3} sx={{ justifyContent: "center" }}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              sx={{
                width: "100%",
                maxWidth: "400px",
                backgroundColor: "#1e1e1e",
                color: "#e0e7ff",
                borderRadius: "10px",
                padding: "0.75rem",
                margin: "0 auto",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Avatar
                  src={product.avatar_url}
                  sx={{
                    width: 128,
                    height: 128,
                    fontSize: "1.2rem",
                  }}
                >
                  {product.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: "#ffffff",
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
                <Typography variant="body2" sx={{ marginBottom: "0.4rem" }}>
                  {product.description || "No description available"}
                </Typography>
                <Typography variant="body2">
                  <strong>Stock Level:</strong> {product.stock_level}
                </Typography>
                <Typography variant="body2">
                  <strong>Threshold:</strong> {product.threshold_level}
                </Typography>
                <Typography variant="body2">
                  <strong>Price:</strong> ${product.price.toFixed(2)}
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
                    padding: "0.4rem 1rem",
                    "&:hover": {
                      backgroundColor: "white",
                    },
                  }}
                  onClick={() => handleViewAnalytics(product.id)}
                >
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Product;
