// src/pages/OauthSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OauthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL parameters instead of making API call
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Store token and redirect to dashboard
      localStorage.setItem("token", token);
      console.log("Token stored successfully");
      navigate("/dashboard");
    } else {
      // No token found - redirect to signin with error
      console.error("No token found in URL");
      navigate("/signin?error=oauth");
    }
  }, [navigate]);

  return <div>Logging you in via Google...</div>;
};

export default OauthSuccess;