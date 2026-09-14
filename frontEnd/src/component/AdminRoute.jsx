import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("ectoo-token");
  const savedUser = localStorage.getItem("ectoo-user");

  if (!token || !savedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(savedUser);

    if (user?.role !== "admin") {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem("ectoo-token");
    localStorage.removeItem("ectoo-user");

    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;