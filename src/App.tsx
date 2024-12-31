import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../components/Home";
import Login from "../components/Login";
import SignUpForm from "../components/SignUpForm";
import Dashboard from "../components/Dashboard";
import AuthCallback from "../components/AuthCallback";
import ProductDetail from "../components/ProductDetail";

const App: React.FC = () => {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/dashboard/products/:id" element={<ProductDetail />} />
          {/* Handle unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
