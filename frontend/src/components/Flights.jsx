import React, { useState, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
const majorCities = [
  "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Kolkata", "Pune",
  "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Surat", "Indore", "Bhopal",
  "Nagpur", "Patna", "Vadodara", "Ranchi", "Raipur", "Guwahati", "Bhubaneswar",
  "Amritsar", "Visakhapatnam", "Coimbatore", "Thiruvananthapuram", "Dehradun",
  "Udaipur", "Mysore", "Jodhpur", "Agra"
];
const Flights = () => {
  const navigate= useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
const { destination, isFlyable: initialIsFlyable } = location.state || {}; 
  const [isFlyable, setIsFlyable] = useState(initialIsFlyable);
  const [flightMessage, setFlightMessage] = useState("");
  const [flights, setFlights] = useState([]);
  const [fromCity, setFromCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Initial check: is destination flyable?
    if (!initialIsFlyable) {
      setFlightMessage(`Oops! ${destination} is not directly flyable.`);
    }
  }, [initialIsFlyable, destination]);


  const handleShowFlights = async () => {
    if (!fromCity) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/search/flights?destination=${destination}&fromCity=${fromCity}`);
      setFlights(response.data.flights);
    } catch (err) {
      console.error("Error fetching flights:", err.response?.data || err.message);
      setFlightMessage(err.response?.data?.error || "Error fetching flights.");
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 bg-gray-50">
      <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white flex justify-start mt-4 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ⬅ Back
        </button>
            <h1 className="flex justify-center text-2xl font-bold mb-4">Flight Options to {destination}</h1>

      {!isFlyable ? (
        <>
          <p className="text-red-600">{flightMessage}</p>
          <a href="https://www.makemytrip.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Check on MakeMyTrip for alternatives.
          </a>
        </>
      ) : (
        <>
          <label className="flex justify-center block mb-2 text-gray-700 text-2xl font-medium">
            Select your city:
          </label>
          <div className="flex justify-center">
          <select
            value={fromCity}
            onChange={(e) => setFromCity(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none max-h-60 overflow-y-auto"
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
            className="bg-blue-600 h-10 w-40 text-white mt-12  rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Show Flights"}
          </button>
 </div>
          {flights.length > 0 && (
            <div className="mt-6 justify-center">
              <h2 className="text-xl font-semibold mb-2">Available Flights</h2>
              <div className=" space-y-4">
                {flights.map((flight, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                  >
                    <p><strong>Flight:</strong> {flight.airline} ({flight.flightNumber})</p>
                    <p><strong>From:</strong> {flight.from} → <strong>To:</strong> {flight.to}</p>
                    <p><strong>Departure:</strong> {flight.departure}</p>
                    <p><strong>Arrival:</strong> {flight.arrival}</p>
                    <p><strong>Price:</strong> {flight.price}</p>
                    <p>For more options and booking visit 
                      <a className="text-red-600 " href="https://www.makemytrip.com/" target="_blank" rel="noopener noreferrer"> Make My Trip </a></p>
                  </div>
              
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Flights;