// src/pages/OauthSuccess.jsx
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OauthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoogleToken = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/auth/google-login", {}, {
          withCredentials: true,
        });
        const { token } = res.data;
        localStorage.setItem("token", token);
        navigate("/dashboard");
      } catch (err) {
        console.error("OAuth token error:", err);
        navigate("/signin");
      }
    };

    fetchGoogleToken();
  }, []);

  return <div>Logging you in via Google...</div>;
};

export default OauthSuccess;
