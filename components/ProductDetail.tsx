import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import Alert from "@mui/material/Alert";

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

interface UpdateField {
  field_name: keyof ProductData;
  new_value: string | number;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updates, setUpdates] = useState<UpdateField[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:5000/product/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleCheckboxChange = (
    field_name: keyof ProductData,
    checked: boolean
  ) => {
    if (checked) {
      setUpdates((prev) => [...prev, { field_name, new_value: "" }]);
    } else {
      setUpdates((prev) =>
        prev.filter((update) => update.field_name !== field_name)
      );
    }
  };

  const handleValueChange = (
    field_name: keyof ProductData,
    value: string | number
  ) => {
    setUpdates((prev) =>
      prev.map((update) =>
        update.field_name === field_name
          ? { ...update, new_value: value }
          : update
      )
    );
  };

  const handleSubmit = async () => {
    if (updates.length === 0) {
      alert("Please select at least one field to update.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/product/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update product");
        return;
      }

      alert("Product updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError("An error occurred while updating the product.");
    }
  };
  if (loading) return <div>Loading product...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <Box sx={{ padding: "2rem", color: "#e0e7ff" }}>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}
      >
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
          <CardContent sx={{ textAlign: "center" }}>
            <Avatar
              src={product.avatar_url}
              sx={{
                width: 128,
                height: 128,
                fontSize: "1.5rem",
                margin: "0 auto",
              }}
            >
              {product.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5">{product.name}</Typography>
            <Typography variant="body2" sx={{ color: "#b0b7cc" }}>
              {product.category}
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
            {product.supplier && (
              <Typography variant="body2">
                <strong>Supplier:</strong> {product.supplier}
              </Typography>
            )}
          </CardContent>
          <CardContent sx={{ textAlign: "center" }}>
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
      <Box
        sx={{
          padding: "1rem",
          backgroundColor: "#1e1e1e",
          borderRadius: "8px",
          color: "white",
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
          Update Product
        </Typography>
        <Grid container spacing={2}>
          {Object.keys(product).map((key) => (
            <Grid item xs={12} sm={4} key={key}>
              <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        handleCheckboxChange(
                          key as keyof ProductData,
                          e.target.checked
                        )
                      }
                    />
                  }
                  label={key}
                />
                <TextField
                  disabled={
                    !updates.find((update) => update.field_name === key)
                  }
                  onChange={(e) =>
                    handleValueChange(key as keyof ProductData, e.target.value)
                  }
                  placeholder={`Current: ${product[key as keyof ProductData]}`}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      "& fieldset": {
                        borderColor: "#d9d9d9",
                      },
                      "&:hover fieldset": {
                        borderColor: "#4f80ff",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#4f80ff",
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                    },
                    "& .MuiInputLabel-root": {
                      color: "white",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white",
                    },
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "white",
            color: "black",
            textTransform: "none",
            fontWeight: "bold",
            marginTop: "1.5rem",
            "&:hover": {
              backgroundColor: "white",
            },
          }}
          onClick={handleSubmit}
        >
          Update Product
        </Button>
        {product.threshold_level > product.stock_level ? (
          <Alert severity="warning">
            WARNING: {product.name} is below threshold level, update stock soon!
          </Alert>
        ) : null}
      </Box>
    </Box>
  );
};

export default ProductDetail;
