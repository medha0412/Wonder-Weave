import React ,{useState,useEffect} from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
const HoRo=()=>{
   const navigate=useNavigate();
   const location= useLocation();
   const { hotels=[], restaurants=[], destination="destination"} =location.state || {};

return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
    
      <div className="justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-primary text-white flex justify-start px-4 py-2 rounded hover:bg-secondary transition"
        >
          ⬅ Back
        </button>
        <h1 className="flex justify-center text-4xl mt-2 font-bold text-gray-800">
          Stay & Eat in {destination}
        </h1>
        
      </div>

     
      <div className="flex flex-col md:flex-row gap-6">
        {/* Hotels */}
        <div className="flex-1 bg-white shadow-lg rounded-2xl p-4 overflow-y-auto max-h-[80vh]">
          <h2 className="text-2xl font-semibold text-center mb-4 text-blue-700">🏨 Hotels</h2>
          {hotels.length === 0 ? (
            <p className="text-center text-gray-500">No hotels found.</p>
          ) : (
            <div className="space-y-4">
              {hotels.map((hotel, index) => (
                <div key={hotel.id || index} className="flex gap-4 bg-gray-50 rounded-lg shadow p-3">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-32 h-24 rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <h3 className="text-lg font-semibold">{hotel.name}</h3>
                    <p className="text-sm text-gray-500">{hotel.address}</p>
                    <p className="text-sm text-gray-500">Rating: ⭐ {hotel.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Restaurants */}
        <div className="flex-1 bg-white shadow-lg rounded-2xl p-4 overflow-y-auto max-h-[80vh]">
          <h2 className="text-2xl font-semibold text-center mb-4 text-red-600">🍽️ Restaurants</h2>
          {restaurants.length === 0 ? (
            <p className="text-center text-gray-500">No restaurants found.</p>
          ) : (
            <div className="space-y-4">
              {restaurants.map((resto, index) => (
                <div key={resto.id || index} className="flex gap-4 bg-gray-50 rounded-lg shadow p-3">
                  <img
                    src={resto.image}
                    alt={resto.name}
                    className="w-32 h-24 rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    <h3 className="text-lg font-semibold">{resto.name}</h3>
                    <p className="text-sm text-gray-500">{resto.address}</p>

                    <p className="text-sm text-gray-500">Rating: ⭐ {resto.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HoRo;