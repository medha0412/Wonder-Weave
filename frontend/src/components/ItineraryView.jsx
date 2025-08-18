import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import PlaceCard from "./PlaceCard";
import SortablePlaceCard from "./SortablePlaceCard";
import html2pdf from "html2pdf.js";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { MouseSensor, TouchSensor } from "@dnd-kit/core";

import resto1 from "../assets/resto1.webp";
import hotel from "../assets/hotel.jpg";
import plane from "../assets/plane.png";
import noplace from "../assets/noplace.png"
import Flights from "./Flights";
import HoRo from "./HotelsandResto";

const ItineraryView =()=>{
  const location= useLocation();
  const {id}= useParams();
  const { itinerary=[], destination="", timeSlots=[], isFlyable = true, flights=[],hotels=[],restaurants=[] } = location.state || {};
  const [activeTab, setActiveTab] = useState(null);
  const [localItinerary, setLocalItinerary] = useState(itinerary);
  
  const navigate =useNavigate();
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragEnd = (event, currentDayIndex) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  setLocalItinerary((prev) => {
    const updated = [...prev];
    const entry = updated[currentDayIndex];

    const day = Array.isArray(entry) ? entry : [...(entry.places || [])];

    const oldIndex = day.findIndex((item) => (item.id || item.xid) === active.id);
    const newIndex = day.findIndex((item) => (item.id || item.xid) === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(day, oldIndex, newIndex);

      if (Array.isArray(entry)) {
        updated[currentDayIndex] = reordered;
      } else {
        updated[currentDayIndex] = { ...entry, places: reordered };
      }
    }

    return updated;
  });
};



    const typeToImage = {
  Flights: plane,
  Hotels: hotel,
  Restaurants: resto1,
};
const itineraryRef = useRef();
const [destinationImage, setDestinationImage] = useState('');
useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(`https://wonder-weave-1.onrender.com/api/image?destination=${encodeURIComponent(destination)}`);
        setDestinationImage(response.data.imageUrl);
      } catch (error) {
        console.error("Error fetching destination image:", error);
        setDestinationImage(noplace); 
      }
    };

    if (destination) {
      fetchImage();
    }
  }, [destination]);

const handleDownloadPDF = async () => {
  try{
    if(itineraryRef.current){
      html2pdf().set({
      margin: 0.5,
      filename: `Itinerary_${destination}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    }).from(itineraryRef.current).save();

  }  
    const token = localStorage.getItem("token");

    const flattenedPlaces = localItinerary.flatMap(day => {
    const dayPlaces = Array.isArray(day) ? day : (day.places || []);    
       return dayPlaces
        .filter(place => place.name && place.name !== "To be decided") 
        .map(place => ({
          placeId: place.id || place.xid || null,
          name: place.name,
          description: null, 
          address: null, 
          rating: null, 
          image: place.image,
          visitDate: day.date || null 
        }));
    });
    
    const itineraryData = {
      title: `${destination} Trip`,
      destination,
      startDate: location.state.startDate,
      endDate: location.state.endDate,
      places: flattenedPlaces,
      createdAt: new Date()
    };
    console.log(" Sending itinerary data:", itineraryData);
    const response = await axios.post(
      "https://wonder-weave-1.onrender.com/api/itinerary/save",itineraryData,{
      headers: {Authorization:`Bearer ${token}`}
    }
  )
    if(response.status===201){
      alert("Itinerary Saved");
    }else{
      alert("Issues in saving Itinerary");
    }
}catch(error){
  console.error("Itinerary cant be saved in DB", error);
  alert("Error saving the itinerary. Please try later.")
}
};
  return (
    <div className="px-6  ">
      <div>
      <button
          onClick={() => navigate(-1)}
          className="bg-blue-600 text-white flex justify-start mt-4 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          ⬅ Back
        </button>
      <h2 className="text-3xl font-bold text-center ">
        Let's Explore {destination}
      </h2>
</div>
      <div className="flex justify-center items-center gap-6 mt-6 flex-wrap">
  <div
    className="relative w-64 h-40 rounded-xl overflow-hidden shadow-md transform hover:scale-105 transition"
    onClick={() => {
      if (!isFlyable) return;
     navigate('/flights', { state: { destination, isFlyable } })}
    }
    style={{
      backgroundImage: `url(${typeToImage["Flights"]})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: !isFlyable ? 0.5 : 1,
      cursor: !isFlyable ? "not-allowed" : "pointer",
    }}
  >
    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-4">
      <h3 className="text-xl font-semibold">Flights</h3>
      {!isFlyable ? (
        <>
          <p className="text-xs mt-1">No direct flights available</p>
          <a
            href="https://www.makemytrip.com/flights/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline mt-1"
          >
            Check on MakeMyTrip
          </a>
        </>
      ) : (
        <p className="text-sm mt-1">Click to view flights</p>
      )}
    </div>
  </div>

  <div
    className="w-64 h-40 rounded-xl overflow-hidden shadow-md bg-cover bg-center"
    style={{
      backgroundImage: `url(${destinationImage})`, 
    }}
  >
    <div className="h-full w-full bg-black/30 flex flex-col  items-center justify-center ">
      <h1 className="text-white text-xl font-semibold mt-10">Let’s go to {destination}</h1>
      <h2 className="text-white mt-2">Image from Pexels</h2>
    </div>
  </div>

  {/* Hotels + Restaurants Card */}
  <div
    className="relative w-64 h-40 rounded-xl overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition"
    onClick={() => navigate('/hotel&resto', { state: { hotels,restaurants,destination } })}
    style={{
      backgroundImage: `url(${typeToImage["Restaurants"]})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-4">
      <h3 className="text-xl font-semibold">Stay & Eat</h3>
      <p className="text-sm mt-1">Click to view hotels and restaurants</p>
    </div>
  </div>
 

</div>
{activeTab === "Flights" && (
  <div className="mt-6">
    <Flights
      destination={destination}
      flights={flights}
      isFlyable={isFlyable}
      flightMessage={`Oops! ${destination} is not directly flyable. Try MakeMyTrip`}
    />
  </div>
)}

      <div ref={itineraryRef} className="flex flex-wrap gap-6 justify-center">
        {localItinerary.map((entry, dayIndex) => {
          const day = Array.isArray(entry) ? entry : entry.places || [];
                    const dayPlaceIds = day.map(p => p.xid);

          return (
            <div key={dayIndex} className="w-[300px] bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-xl font-semibold text-center mb-4 text-blue-700 bg-blue-100 py-2 rounded-xl shadow-sm">
                Day {dayIndex + 1}
              </h3>

              <DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={(event) => handleDragEnd(event, dayIndex)}
>
  <SortableContext
  items={day.map((place) => place.id || place.xid)}
  strategy={verticalListSortingStrategy}
>
  {day.length === 0 ? (
    <div className="flex justify-center flex-col items-center bg-cover bg-center rounded-xl text-black">
      <img className="h-20 w-20 mt-24" src={noplace} alt="noplace" />
      <h1>No more places to visit</h1>
    </div>
  ) : (
    <ul className="space-y-3">
  {day.map((place, index) => (
    <SortablePlaceCard
      key={place.id || place.xid}
      id={place.id || place.xid}
      place={place}
      dayIndex={dayIndex}
      time={timeSlots[index]} 
    />
  ))}
</ul>

  )}
</SortableContext>

</DndContext>

                        </div>
                    );
                })}
            </div>
            <div className=" flex justify-center py-10 ">
              <button onClick={handleDownloadPDF}
              className="bg-green-600 h-12 w-40 rounded text-xl font-bold hover:bg-green-700 transition border border-black"> Save Itinerary </button>
            </div>
        </div>
    );
};

export default ItineraryView;
    