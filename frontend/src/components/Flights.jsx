import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../utils/api";

const majorCities = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune",
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Surat", "Indore", "Bhopal",
  "Nagpur", "Patna", "Vadodara", "Ranchi", "Raipur", "Guwahati", "Bhubaneswar",
  "Amritsar", "Visakhapatnam", "Coimbatore", "Thiruvananthapuram", "Dehradun",
  "Udaipur", "Mysore", "Jodhpur", "Agra"
];

const Flights = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { destination, isFlyable: initialIsFlyable } = location.state || {};
  const [isFlyable, setIsFlyable] = useState(initialIsFlyable);
  const [flightMessage, setFlightMessage] = useState("");
  const [flights, setFlights] = useState([]);
  const [fromCity, setFromCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const selectionRef = useRef(null);

  useEffect(() => {
    if (!initialIsFlyable) {
      setFlightMessage(`✈️ Oops! ${destination} is not directly flyable.`);
    }
  }, [initialIsFlyable, destination]);

  const handleShowFlights = async () => {
    if (!fromCity) {
      setFlightMessage("⚠️ Please select a departure city.");
      return;
    }
    if (fromCity === destination) {
      setFlightMessage("⚠️ Departure and destination cities cannot be the same.");
      setFlights([]);
      return;
    }
    setLoading(true);
    setFlightMessage("");

    try {
      const response = await axios.get(
        api(`/search/flights?destination=${destination}&fromCity=${fromCity}`)
      );
      setFlights(response.data.flights);
    } catch (err) {
      console.error("Error fetching flights:", err.response?.data || err.message);
      setFlightMessage(err.response?.data?.error || "❌ Error fetching flights.");
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const getAirlineColor = (airline) => {
    const colors = {
      'Indigo': 'bg-blue-600',
      'AirIndia': 'bg-orange-600',
      'Vistara': 'bg-purple-600',
      'SpiceJet': 'bg-red-600',
      'GoAir': 'bg-green-600',
    };
    return colors[airline] || 'bg-blue-600';
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8 bg-gray-50">
      {/* Back button - positioned at top left */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => {
            if (flights.length > 0) {
              setFlights([]);
              setTimeout(() => selectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
            } else {
              navigate(-1);
            }
          }}
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full border-2 border-black hover:bg-gray-50 transition font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {flights.length > 0 ? 'Back to city selection' : 'Back'}
        </button>
      </div>

      {/* Heading with plane icon */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-5xl">✈️</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-black">
            Flight Options to {destination}
          </h1>
        </div>
        <p className="text-lg text-gray-600 mt-2">
          Find the perfect flight for your journey
        </p>
      </div>

      {!isFlyable ? (
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-red-600 mb-2 text-lg">{flightMessage}</p>
          <a
            href="https://www.makemytrip.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Check on MakeMyTrip for alternatives
          </a>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* City selection card */}
          {flights.length === 0 && (
            <div ref={selectionRef} className="bg-white rounded-3xl p-8 sm:p-10 mb-8 border border-gray-200" 
                 style={{ boxShadow: '0 4px 20px rgba(44, 110, 73, 0.15)' }}>
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3">
                Select your departure city
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Choose where you'll be flying from
              </p>

              {/* City buttons grid - all cities, compact boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 mb-8 max-h-56 overflow-auto p-2 border border-gray-200 rounded-lg">
                {majorCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setFromCity(city)}
                    className={`py-2 px-3 rounded-lg border text-xs sm:text-sm font-medium transition ${
                      fromCity === city
                        ? 'bg-[#2C6E49] text-white border-[#2C6E49]'
                        : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

              {/* Show Flights button */}
              <div className="text-center">
                <button
                  onClick={handleShowFlights}
                  disabled={!fromCity || loading}
                  className="bg-white text-black px-6 py-2.5 rounded-full border-2 border-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-base transition"
                >
                  {loading ? "Loading..." : (fromCity ? `Show Flights from ${fromCity}` : "Show Flights")}
                </button>
              </div>
            </div>
          )}

          {/* Message */}
          {flightMessage && (
            <p className="text-center text-red-600 mb-6 text-lg">{flightMessage}</p>
          )}

          {/* Flights list */}
          {flights.length > 0 && (
            <div>
              {/* Back button when flights are showing */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 mb-6 border border-gray-200"
                   style={{ boxShadow: '0 4px 20px rgba(44, 110, 73, 0.15)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <h2 className="text-3xl font-bold text-black">
                    Available Flights
                  </h2>
                </div>
                <p className="text-gray-600 text-lg">
                  Showing {flights.length} flights from <span className="font-semibold">{fromCity}</span> to <span className="font-semibold">{destination}</span>
                </p>
              </div>

              {/* Flight cards */}
              <div className="space-y-6">
                {flights.map((flight, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 hover:border-[#2C6E49] transition"
                    style={{ boxShadow: '0 4px 20px rgba(44, 110, 73, 0.15)' }}
                  >
                    {/* Airline header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 ${getAirlineColor(flight.airline)} rounded-2xl flex items-center justify-center`}>
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-black">
                            {flight.airline}
                          </h3>
                          <p className="text-gray-600">Direct Flight</p>
                        </div>
                      </div>
                      {index === 0 && (
                        <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-semibold flex items-center gap-1">
                          <span>⭐</span> Best Price
                        </div>
                      )}
                    </div>

                    {/* Flight details */}
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                      <div className="text-center sm:text-left mb-4 sm:mb-0">
                        <p className="text-sm font-semibold text-gray-600 uppercase mb-1">
                          Departure
                        </p>
                        <p className="text-4xl font-bold text-black mb-1">
                          {flight.departure}
                        </p>
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{flight.from}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center mb-4 sm:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-px w-12 bg-gray-300"></div>
                          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          <div className="h-px w-12 bg-gray-300"></div>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">3h 0m</span>
                        </div>
                      </div>

                      <div className="text-center sm:text-right">
                        <p className="text-sm font-semibold text-gray-600 uppercase mb-1">
                          Arrival
                        </p>
                        <p className="text-4xl font-bold text-black mb-1">
                          {flight.arrival}
                        </p>
                        <div className="flex items-center gap-2 text-gray-600 justify-center sm:justify-end">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{flight.to}</span>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-6"></div>

                    {/* Bottom section */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                        Economy • Baggage included
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-black">{flight.price}</p>
                          <p className="text-sm text-gray-600">per person</p>
                        </div>
                        <a
                          href="https://www.makemytrip.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-black px-6 py-3 rounded-full border-2 border-black hover:bg-gray-50 transition font-bold"
                        >
                          Book Now
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Flights;