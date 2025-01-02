import React, { useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import Check from "@mui/icons-material/Check";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

interface Plan {
  name: string;
  price: string;
  features: string[];
  id: string;
}

const PaymentForm: React.FC<{ clientSecret: string; planId: string }> = ({
  clientSecret,
  planId,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } else if (paymentIntent?.status === "succeeded") {
      alert("Payment successful!");
      navigate("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ width: "400px", margin: "0 auto" }}>
      <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
        Enter Payment Details
      </Typography>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          marginTop: "1rem",
          backgroundColor: "#007bff",
          color: "#fff",
          "&:hover": { backgroundColor: "#0056b3" },
        }}
      >
        Pay Now
      </Button>
    </form>
  );
};

const PricingCards: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const plans: Plan[] = [
    {
      name: "FREE",
      price: "$0",
      features: ["Basic Support", "Limited Access"],
      id: "free_plan_id",
    },
    {
      name: "PRO",
      price: "$9.99 / month",
      features: ["Advanced Analytics", "Priority Support"],
      id: "pro_plan_id",
    },
    {
      name: "BUSINESS",
      price: "$29.99 / month",
      features: ["Unlimited Access", "Dedicated Support"],
      id: "business_plan_id",
    },
  ];

  const handleSelectPlan = async (planId: string) => {
    try {
      setSelectedPlan(planId);

      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("User not authenticated");

      const response = await fetch("http://localhost:5000/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan_id: planId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment intent");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error selecting plan:", error);
      alert("Failed to select the plan. Please try again.");
    }
  };

  if (clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
            color: "#333",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: "1.5rem" }}>
            Complete Your Payment
          </Typography>
          <PaymentForm clientSecret={clientSecret} planId={selectedPlan!} />
        </Box>
      </Elements>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
        gap: 2,
      }}
    >
      {plans.map((plan) => (
        <Card
          key={plan.id}
          size="lg"
          variant="outlined"
          sx={{
            borderColor: selectedPlan === plan.id ? "blue" : "transparent",
          }}
        >
          <Chip size="sm" variant="outlined" color="neutral">
            {plan.name}
          </Chip>
          <Typography level="h2">{plan.name}</Typography>
          <Divider inset="none" />
          <List size="sm" sx={{ mx: "calc(-1 * var(--ListItem-paddingX))" }}>
            {plan.features.map((feature, idx) => (
              <ListItem key={idx}>
                <ListItemDecorator>
                  <Check />
                </ListItemDecorator>
                {feature}
              </ListItem>
            ))}
          </List>
          <Divider inset="none" />
          <CardActions>
            <Typography level="title-lg" sx={{ mr: "auto" }}>
              {plan.price}
            </Typography>
            {plan.name !== "FREE" ? (
              <Button
                variant="soft"
                color="neutral"
                endDecorator={<KeyboardArrowRight />}
                onClick={() => handleSelectPlan(plan.id)}
              >
                Select
              </Button>
            ) : null}
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default PricingCards;
