import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
export function Signin() {
  const navigate = useNavigate();
    useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    navigate("/dashboard", { replace: true });
  }
}, [navigate]);


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem("showWelcome", "true");

      navigate("/dashboard", {
  state: { fromLogin: true, userName: response.data.name || "User" }
    });
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again or Sign Up first.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Sign In To Your Account</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4 border border-border"
      >
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

        <div>
          <label htmlFor="email" className="block font-semibold mb-1 text-foreground">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/60"
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-semibold mb-1 text-foreground">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/60"
            placeholder="••••••••"
            required
            minLength={8}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition font-semibold"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
