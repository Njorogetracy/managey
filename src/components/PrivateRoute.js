import React from "react";
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const PrivateRoute = ({ children }) => {
  const currentUser = useCurrentUser();

  // If user is not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }}/>;
  }

  return children;
};

export default PrivateRoute;
