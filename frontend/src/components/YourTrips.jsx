import React, { useEffect, useState } from "react";
import axios from "axios";

export default function YourTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/itinerary/mytrips", {
          withCredentials: true, // important if using cookies/JWT
        });
        setTrips(res.data);
      } catch (error) {
        console.error("Error fetching trips", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading your trips...</p>;

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="h-[100px] w-[600px] bg-purple-400 rounded-full flex items-center justify-center">
        <h1 className="text-black text-4xl font-bold">Your Previous Trips</h1>
      </div>

      <div className="mt-10 w-[80%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.length > 0 ? (
          trips.map((trip) => (
            <div key={trip._id} className="p-6 bg-white rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold">{trip.destination}</h2>
              <p className="text-gray-600">From: {new Date(trip.startDate).toDateString()}</p>
              <p className="text-gray-600">To: {new Date(trip.endDate).toDateString()}</p>
              <button className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                View Itinerary
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 mt-6 text-xl">No trips saved yet. <a href="/dashboard" className="text-red-400 hover:underLine"> Click to Plan your first trip. </a> </p>
        )}
      </div>
    </div>
  );
}
