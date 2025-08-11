import React, { useState, useEffect } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

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
        `http://localhost:5000/api/search/flights?destination=${destination}&fromCity=${fromCity}`
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

  return (
    <div className="min-h-screen px-6 py-8 bg-gradient-to-b from-blue-50 to-white">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-6"
      >
        ⬅ Back
      </button>

      {/* Heading */}
      <h1 className="text-center text-3xl font-bold text-gray-800 mb-6">
        ✈️ Flight Options to <span className="text-blue-600">{destination}</span>
      </h1>

      {!isFlyable ? (
        <div className="text-center">
          <p className="text-red-600 mb-2">{flightMessage}</p>
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
        <div className="max-w-xl mx-auto">
          {/* City selection */}
          <label className="block mb-3 text-gray-700 text-lg font-medium text-center">
            Select your departure city:
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3">
            <select
              value={fromCity}
              onChange={(e) => setFromCity(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              size="6"
            >
              <option value="">-- Choose a city --</option>
              {majorCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <button
              onClick={handleShowFlights}
              disabled={!fromCity || loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Show Flights"}
            </button>
          </div>

          {/* Message */}
          {flightMessage && (
            <p className="text-center text-red-600 mt-4">{flightMessage}</p>
          )}

          {/* Flights list */}
          {flights.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Available Flights
              </h2>
              <div className="grid gap-4">
                {flights.map((flight, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-5 bg-white shadow hover:shadow-lg transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-blue-600">
                        {flight.airline}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {flight.flightNumber}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      <strong>From:</strong> {flight.from} →{" "}
                      <strong>To:</strong> {flight.to}
                    </p>
                    <p className="text-gray-600">
                      <strong>Departure:</strong> {flight.departure}
                    </p>
                    <p className="text-gray-600">
                      <strong>Arrival:</strong> {flight.arrival}
                    </p>
                    <p className="text-gray-800 font-semibold">
                      Price: {flight.price}
                    </p>
                    <a
                      className="text-blue-500 mt-2 inline-block"
                      href="https://www.makemytrip.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Book on MakeMyTrip →
                    </a>
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
