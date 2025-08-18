import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function YourTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTrips, setExpandedTrips] = useState(new Set());
  const [tripDetails, setTripDetails] = useState({});
  const navigate = useNavigate();

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
        
        setTrips(Array.isArray(data) ? data : []);
        
        if (Array.isArray(data) && data.length > 0) {
          setExpandedTrips(new Set([data[0]._id]));
          
          const firstTripDetails = await fetchTripDetails(data[0]._id, token);
          setTripDetails({ [data[0]._id]: firstTripDetails });
        }
        
      } catch (error) {
        console.error("Error fetching trips", error);
        setError("Failed to load your trips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const fetchTripDetails = async (tripId, token) => {
    try {
      console.log(`Fetching details for trip: ${tripId}`);
      console.log(`Using token: ${token ? 'Token present' : 'No token'}`);
      
      const response = await fetch(`https://wonder-weave-1.onrender.com/api/itinerary/${tripId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });
      
      console.log(`Response status for trip ${tripId}: ${response.status}`);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log(`Trip details response for ${tripId}:`, responseData);
        
        const data = responseData.success ? responseData.data : responseData;
        console.log(`Processed trip details for ${tripId}:`, data);
        return data;
      } else {
        console.error(`Failed to fetch trip ${tripId}:`, response.status, response.statusText);
        const errorText = await response.text();
        console.error(`Error response: ${errorText}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching details for trip ${tripId}:`, error);
      return null;
    }
  };

  const toggleTrip = async (tripId) => {
    const newExpanded = new Set(expandedTrips);
    
    if (expandedTrips.has(tripId)) {
      newExpanded.delete(tripId);
    } else {
      newExpanded.add(tripId);
      
      if (!tripDetails[tripId]) {
        const token = localStorage.getItem("token");
        const details = await fetchTripDetails(tripId, token);
        setTripDetails(prev => ({ ...prev, [tripId]: details }));
      }
    }
    
    setExpandedTrips(newExpanded);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 'Duration unknown';
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
    return `${days} ${days === 1 ? 'day' : 'days'}`;
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
            <div className="space-y-6">
              {trips.map((trip) => {
                const isExpanded = expandedTrips.has(trip._id);
                const details = tripDetails[trip._id];
                
                return (
                  <div 
                    key={trip._id} 
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                  >
                    {/* Trip Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            {trip.destination || trip.title || 'Unknown Destination'}
                          </h2>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="font-medium text-gray-600">From:</span>
                              <span className="text-gray-800">
                                {formatDate(trip.startDate)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="font-medium text-gray-600">To:</span>
                              <span className="text-gray-800">
                                {formatDate(trip.endDate)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center space-x-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {calculateDuration(trip.startDate, trip.endDate)}
                            </span>
                            
                            {trip.places && trip.places.length > 0 && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {trip.places.length} places
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => toggleTrip(trip._id)}
                          className="ml-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        >
                          <svg 
                            className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-6 bg-gray-50">
                        {details && details.places && details.places.length > 0 ? (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Places to Visit
                            </h3>
                            
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {details.places.map((place, index) => (
                                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                                  <div className="flex items-start space-x-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                      <span className="text-purple-600 font-semibold text-sm">
                                        {index + 1}
                                      </span>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-gray-900 truncate">
                                        {place.name || 'Unnamed Place'}
                                      </h4>
                                      
                                      {place.visitDate && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          Visit: {formatDate(place.visitDate)}
                                        </p>
                                      )}
                                      
                                      {place.description && (
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                          {place.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {place.image && (
                                    <div className="mt-3">
                                      <img 
                                        src={place.image} 
                                        alt={place.name}
                                        className="w-full h-24 object-cover rounded-md"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            <p className="text-gray-500 mt-2">No detailed itinerary available for this trip</p>
                          </div>
                        )}
                        
                        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-center">
                          <button 
                            onClick={() => navigate(`/itinerary/${trip._id}`)}
                            className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>View Full Itinerary</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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