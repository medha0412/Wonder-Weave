import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function YourTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

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

        const response = await fetch(api("/itinerary/mytrips"), {
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
        
      } catch (error) {
        console.error("Error fetching trips", error);
        setError("Failed to load your trips. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

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

  const groupPlacesByDate = (places, startDate, endDate) => {
    if (!places || places.length === 0) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const numDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    const days = [];
    const times = ["9:00 AM", "11:00 AM", "1:00 PM", "3:30 PM", "6:00 PM"];
    
    for (let i = 0; i < numDays; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      const dayPlaces = places.filter(place => {
        if (!place.visitDate) return i === 0; // Put places without dates on first day
        const placeDate = new Date(place.visitDate);
        return placeDate.toDateString() === currentDate.toDateString();
      });
      
      days.push({
        date: currentDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        }),
        places: dayPlaces,
        times: times
      });
    }
    
    return days;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-foreground/70 mt-4">Loading your trips...</p>
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
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 bg-white text-foreground px-5 py-2.5 rounded-full border-2 border-black hover:bg-gray-50 transition font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
      </div>
      <div className="flex flex-col items-center">
        <div className="h-[100px] w-full max-w-[600px] bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center shadow-lg">
          <h1 className="text-white text-2xl md:text-4xl font-bold text-center px-4">
            Your Previous Trips
          </h1>
        </div>

        <div className="mt-10 w-full max-w-7xl px-4">
          {trips.length > 0 ? (
            <div className="space-y-8">
              {trips.map((trip) => {
                const daysByDate = groupPlacesByDate(trip.places, trip.startDate, trip.endDate);
                
                return (
                  <div 
                    key={trip._id} 
                    className="bg-white rounded-2xl shadow-lg border border-border overflow-hidden"
                  >
                    {/* Trip Header */}
                    <div className="bg-gradient-to-r from-secondary to-primary p-6 text-white">
                      <h2 className="text-3xl font-bold mb-4">
                        {trip.destination || trip.title || 'Unknown Destination'}
                      </h2>
                      
                      <div className="flex flex-wrap gap-6 text-sm items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="font-medium">From:</span>
                          <span>{formatDate(trip.startDate)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <span className="font-medium">To:</span>
                          <span>{formatDate(trip.endDate)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <span className="font-medium">Duration:</span>
                          <span>{calculateDuration(trip.startDate, trip.endDate)}</span>
                        </div>
                        
                        {trip.places && trip.places.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                            <span className="font-medium">Places:</span>
                            <span>{trip.places.length} locations</span>
                          </div>
                        )}
                        <div className="ml-auto">
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this trip?')) {
                                const token = localStorage.getItem('token');
                                fetch(api(`/itinerary/${trip._id}`), { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
                                  .then(r => { if (!r.ok) throw new Error(); setTrips(prev => prev.filter(t => t._id !== trip._id)); })
                                  .catch(() => alert('Failed to delete. Please try again.'));
                              }
                            }}
                            className="bg-white text-foreground px-4 py-1.5 rounded-full border-2 border-black hover:bg-gray-50 transition font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Itinerary Content */}
                    <div className="p-6">
                      {trip.places && trip.places.length > 0 ? (
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Your Itinerary
                          </h3>
                          
                          {daysByDate.length > 0 ? (
                            <div className="flex flex-nowrap gap-4 overflow-x-auto">
                              {daysByDate.map((day, dayIndex) => (
                                <div key={dayIndex} className="min-w-[260px] bg-white border border-border rounded-xl overflow-hidden">
                                  <div className="bg-primary/10 px-4 py-2 border-b border-border">
                                    <h4 className="font-semibold text-primary text-base">
                                      Day {dayIndex + 1} - {day.date}
                                    </h4>
                                  </div>
                                  <div className="p-3">
                                    {day.places.length > 0 ? (
                                      <div className="space-y-3">
                                        {day.places.map((place, placeIndex) => (
                                          <div key={placeIndex} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border">
                                            <div className="flex-shrink-0 w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center">
                                              <span className="text-secondary font-bold text-xs">
                                                {placeIndex + 1}
                                              </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <h5 className="font-semibold text-foreground text-sm truncate">
                                                {place.name || 'Unnamed Place'}
                                              </h5>
                                              {place.visitDate && (
                                                <p className="text-[11px] text-foreground/70 mt-0.5">Visit: {formatDate(place.visitDate)}</p>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="text-center py-6 text-foreground/60">
                                        <svg className="mx-auto h-10 w-10 text-foreground/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        <p className="text-sm">No places planned for this day</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            // Fallback: display all places in a single list if date grouping fails
                            <div className="space-y-4">
                              {trip.places.map((place, index) => (
                                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <span className="text-purple-600 font-bold text-sm">
                                      {index + 1}
                                    </span>
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-gray-900">
                                      {place.name || 'Unnamed Place'}
                                    </h5>
                                    
                                    {place.visitDate && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Visit: {formatDate(place.visitDate)}
                                      </p>
                                    )}
                                    
                                    {place.description && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        {place.description}
                                      </p>
                                    )}
                                  </div>
                                  
                                  {place.image && (
                                    <div className="flex-shrink-0">
                                      <img 
                                        src={place.image} 
                                        alt={place.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                        }}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <h4 className="text-lg font-medium text-gray-900 mb-2">No Places Added</h4>
                          <p className="text-gray-500">This trip doesn't have any places in the itinerary yet.</p>
                        </div>
                      )}
                    </div>
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
              <h3 className="text-xl font-medium text-foreground mb-2">No trips yet</h3>
              <p className="text-foreground/70 mb-6">
                Start planning your first adventure and create unforgettable memories.
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition-colors duration-200 font-medium"
              >
                Plan Your First Trip
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}