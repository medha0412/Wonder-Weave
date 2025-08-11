import React from "react";
import { CheckCircle } from "lucide-react";

import calendarimg from "../assets/calendarimg.png";
import fullitiimg from "../assets/fullitiimg.png";
import flightimg from "../assets/flightimg.png";
import catimg from "../assets/catimg.png";
import dashimg from "../assets/dashimg.png";
import hotelimg from "../assets/hotelimg.png";
import itineraryimg from "../assets/itineraryimg.png"
import signimg from "../assets/signimg.png";
const steps = [
  {
    title: "Sign In / Sign Up",
    description:
      "Create your account or sign in to get started with planning your dream trip.",
      image: signimg,
  },
  {
    title: "Search Your Destination",
    description:
      "Head to the dashboard and search for your destination or choose from popular places.",
    image: dashimg,
  },
  {
    title: "Select Your Dates",
    description:
      "Pick your travel start and end dates for a customized itinerary.",
    image: calendarimg,
  },
  {
    title: "View Your Itinerary",
    description:
      "We generate your itinerary with real-time data from trusted APIs.",
    image: fullitiimg,
  },
  {
    title: "Explore Flight Options",
    description:
      "Get real-time flight details for flyable destinations and choose your preferred route.",
    image: flightimg,
  },
  {
    title: "Discover Hotels & Restaurants",
    description:
      "Find the best hotels and restaurants with real-time availability and ratings fetched from trusted APIs.",
    image: hotelimg,
  },
  {
    title: "Save Itinerary as PDF",
    description:
      "Download your full itinerary as a PDF to keep it handy anytime.",
    image: itineraryimg,
  },
  {
    title: "Explore India in Blogs",
    description:
      "Check out our blog section to explore India by categories like nature, heritage, adventure, and more.",
    image: catimg,
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-gray-50 py-12 px-6 md:px-16">
      <h2 className="text-4xl font-bold text-center mb-12">
        How It Works
      </h2>
      <div className="space-y-16">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center gap-8 ${
              index % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <img
              src={step.image}
              alt={step.title}
              className="w-full md:w-1/2 rounded-xl shadow-lg object-cover"
            />
            <div className="md:w-1/2">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-green-500" />
                <span className="text-lg font-semibold">
                  Step {index + 1}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
