import React, { useState,useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { api } from "../utils/api";
import { GoogleLogin } from "@react-oauth/google";
export function Signup() {
   const hasRedirected = useRef(false);
   const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
     useEffect(() => {
    if (localStorage.getItem("token")&& !hasRedirected.current) {
       hasRedirected.current = true;
          alert("You are already signed in. Redirecting to dashboard...");
          setRedirecting(true);
          setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 2000);
    }
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.termsAccepted) {
      setError("You must accept the terms.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(api('/auth/register'), {
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      });
     const token = response.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem("showWelcome", "true");

      navigate('/dashboard', {
  state: { fromLogin: true, userName: formData.fullName }
    });
    } catch (err) {
      
      // Axios error handling
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col justify-center items-center bg-background px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mt-12 ">Create Your Account</h1>
        <p className="text-foreground/70">Join WanderLy and start planning your perfect journey</p>
      </div>
        {!redirecting && (
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4 border border-border"
      >
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

        <div>
          <label htmlFor="fullName" className="block font-semibold mb-1 text-foreground">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/60"
            placeholder="Your Name"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block font-semibold mb-1 text-foreground">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/60"
            placeholder="email@example.com"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block font-semibold mb-1 text-foreground">Password</label>
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
          <p className="text-sm text-foreground/60 mt-1">Password must be at least 8 characters long</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block font-semibold mb-1 text-foreground">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/60"
            placeholder="••••••••"
            required
            minLength={8}
          />
        </div>

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="terms"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            required
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm text-foreground/80">
            I agree to the <a href="/terms" className="text-secondary underline">terms of service</a> 
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition font-semibold"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <div className="text-center text-sm text-foreground/70">OR CONTINUE WITH</div>

        <div className="flex justify-center">
          <button
  onClick={() => {
    window.location.href = api('/auth/google');
  }}
  className="bg-secondary hover:bg-primary text-white font-bold py-2 px-4 rounded"
>
   Google
</button>
</div>

        <div className="text-center text-sm mt-4 text-foreground/80">
          Already have an account? <Link to="/signin" className="text-secondary underline">Sign in</Link>
        </div>
      </form>
        )}
         {redirecting && (
      <div className="text-secondary font-medium text-lg mt-8">
        Redirecting to dashboard...
      </div>
    )}
  </div>
);
    
}
