import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import summerImg from "../assets/summer.jpg";
import viewRestaurantImg from "../assets/VIEW RESTAURANTS.png";
import viewFlightsImg from "../assets/VIEW FLIGHTS.png";
import viewHotelsImg from "../assets/VIEW HOTELS.png";
import itineraryCardImg from "../assets/itinerarycard.png";
import browseImg from "../assets/browse.png";

export function Banner() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
    {/* Scoped styles for seamless marquee */}
    <style>{`
      .animate-marquee { animation: scroll-horizontal 15s linear infinite; }
      @keyframes scroll-horizontal {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .marquee-container:hover .animate-marquee { animation-play-state: paused; }
    `}</style>
    <section className="relative w-full h-[70vh] md:h-[70vh] min-h-[60vh] flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={summerImg}
          alt="Summer landscape"
          className="w-full h-full object-cover"
          decoding="async"
          fetchPriority="high"
        />
        {/* Bottom gradient to improve marquee readability over the hero image */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 md:h-56 bg-gradient-to-b from-transparent to-background/90" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1
          className={`text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 transition-all duration-1000 ${
            isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0"
          }`}
          style={{ animationDelay: "0.2s" }}
        >
          Explore the World Mindfully
        </h1>

        <p
          className={`text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto transition-all duration-1000 font-medium ${
            isLoaded ? "animate-fade-in-up opacity-100" : "opacity-0"
          }`}
          style={{ animationDelay: "0.4s" }}
        >
          Create, customize, and share your travel itineraries with a focus on sustainable and authentic experiences
        </p>

        <Link to="/signup" className={isLoaded ? "animate-fade-in-up" : ""} style={{ animationDelay: "0.6s" }}>
          <button
            className={`px-8 py-4 rounded-full font-semibold text-white bg-primary hover:bg-secondary hover:shadow-lg transition-all duration-300 inline-block ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            Start Planning
          </button>
        </Link>
      </div>

    </section>
    {/* Feature cards marquee */}
    <div className="marquee-container relative w-full bg-background/0 overflow-hidden -mt-16 md:-mt-20 z-50">
      <div className="flex whitespace-nowrap animate-marquee will-change-[transform]">
        {/* Track duplicated for seamless loop */}
        <div className="flex gap-8 px-4 py-6 flex-shrink-0">
          {[viewFlightsImg, viewHotelsImg, viewRestaurantImg, itineraryCardImg, browseImg].map((imgSrc, idx) => (
            <div
              key={`marquee-a-`+idx}
              className="relative overflow-hidden rounded-2xl shadow-xl shadow-black/20 w-32 h-40 sm:w-36 sm:h-48 md:w-40 md:h-56 lg:w-44 lg:h-64 rotate-1 md:rotate-2 transform"
            >
              <img src={imgSrc} alt="feature card" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="flex gap-8 px-4 py-6 flex-shrink-0">
          {[viewFlightsImg, viewHotelsImg, viewRestaurantImg, itineraryCardImg, browseImg].map((imgSrc, idx) => (
            <div
              key={`marquee-b-`+idx}
              className="relative overflow-hidden rounded-2xl shadow-xl shadow-black/20 w-32 h-40 sm:w-36 sm:h-48 md:w-40 md:h-56 lg:w-44 lg:h-64 rotate-1 md:rotate-2 transform"
            >
              <img src={imgSrc} alt="feature card" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}