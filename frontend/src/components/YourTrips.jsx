import React, { useEffect, useState } from "react";
import axios from "axios";

export default function YourTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
         setError(null);
           const token = localStorage.getItem("token");

            if (!token) {
          setError("Please log in to view your trips");
          setLoading(false);
          return;
        }
        const response = await fetch("https://wonder-weave-1.onrender.com/api/itinerary/mytrips", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
        });

        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log("API Response:", data);
        console.log("Data type:", typeof data);
        console.log("Is array:", Array.isArray(data));
        
        setTrips(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching trips", error);
        setError("Failed to load your trips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleViewItinerary = (tripId) => {
    console.log(`Viewing itinerary for trip: ${tripId}`);
  };

  if (loading) {
   return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="flex flex-col items-center">
        <div className="h-[100px] w-full max-w-[600px] bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
          <h1 className="text-white text-2xl md:text-4xl font-bold text-center px-4">
            Your Previous Trips
          </h1>
        </div>

        <div className="mt-10 w-full max-w-7xl px-4">
          {trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <div 
                  key={trip._id} 
                  className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {trip.destination || trip.title || 'Unknown Destination'}
                    </h2>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600 flex items-center">
                        <span className="font-medium">From:</span>
                        <span className="ml-2">
                          {trip.startDate 
                            ? new Date(trip.startDate).toLocaleDateString()
                            : 'Not specified'
                          }
                        </span>
                      </p>
                      <p className="text-gray-600 flex items-center">
                        <span className="font-medium">To:</span>
                        <span className="ml-2">
                          {trip.endDate 
                            ? new Date(trip.endDate).toLocaleDateString()
                            : 'Not specified'
                          }
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {trip.startDate && trip.endDate 
                        ? Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + ' days'
                        : 'Duration unknown'
                      }
                    </span>
                    <button 
                      onClick={() => handleViewItinerary(trip._id)}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 text-sm font-medium"
                    >
                      View Itinerary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-6">
                <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No trips yet</h3>
              <p className="text-gray-600 mb-6">
                Start planning your first adventure and create unforgettable memories.
              </p>
              <a 
                href="/dashboard" 
                className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium"
              >
                Plan Your First Trip
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}