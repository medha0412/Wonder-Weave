import React, { useState } from "react";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import SortablePlaceCard from "./SortablePlaceCard";
//import PlaceCard from "./PlaceCard";
//import ItineraryView from "./ItineraryView";
import { arrayMove } from "@dnd-kit/sortable";

// Components

// Images
import udaipur from "../assets/udaipur.jpg";
import ladakh from "../assets/ladakh.jpg";
import manali from "../assets/manali.jpg";
import goa from "../assets/goa.jpg";
import mathura from "../assets/mathura.jpg";
import kedarnath from "../assets/kedarnath.jpg";
import ujjain from "../assets/ujjain.jpg";
import mumbai from "../assets/mumbai.jpg";

Modal.setAppElement("#root");

const favoriteDestinations = [
  { title: "Udaipur", image: udaipur },
  { title: "Ladakh", image: ladakh },
  { title: "Manali", image: manali },
  { title: "Kedarnath", image: kedarnath },
  { title: "Ujjain", image: ujjain },
  { title: "Mumbai", image: mumbai },
  { title: "Mathura", image: mathura },
  { title: "Goa", image: goa },
];
const timeSlots = ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"];

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  //const [itineraryVisible, setItineraryVisible] = useState(false);
  const [itinerary, setItinerary] = useState([]);
  const [error, setError] = useState("");
const [destinationToSearch, setDestinationToSearch] = useState("");

  //const handleSearch = async (destination, startDate, endDate) => {
  //try {
   // const response = await axios.get("http://localhost:5000/api/search", {
      //params: {
       // destination,
        //startDate,
        //endDate,
     // },
    //});

    //const { itinerary, flights, hotels, restaurants } = response.data;

    //setItinerary(itinerary);
    //setShowExploreCards(false); 
  //} catch (error) {
   // console.error("Search failed:", error);
 // }


console.log("Dashboard component rendered.");
 // console.log("itineraryVisible:", itineraryVisible); // Should be false
  console.log("searchResults:", searchResults);
  

  const handleDragEnd = (event, dayIndex) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;
    if (!itinerary[dayIndex] || !itinerary[dayIndex].places) {
        console.warn(`Drag End: Invalid dayIndex (${dayIndex}) or places array not found.`);
        return;
    }
    const currentDayPlaces = [...itinerary[dayIndex].places];
    const oldIndex = currentDayPlaces.findIndex((p) => p.xid === active.id);
        const newIndex = currentDayPlaces.findIndex((p) => p.xid === over.id);
       if (oldIndex !== -1 && newIndex !== -1) {
            const newOrder = arrayMove(currentDayPlaces, oldIndex, newIndex);
const updatedPlacesWithTimes = newOrder.map((place, idx) => ({
                ...place,
                time: timeSlots[idx] || "",
}));
    const updatedItinerary = [...itinerary];
      updatedItinerary[dayIndex] = {
                ...updatedItinerary[dayIndex],
                places: updatedPlacesWithTimes,
      };
       setItinerary(updatedItinerary);
    }
  };


  const navigate = useNavigate();

  const handleDateConfirm = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
      const diffInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    if (endDate <= startDate) {
      alert("End date must be after start date.");
      return;
    }
    if (diffInDays > 3) {
    alert("Only trips of up to 3 days are allowed.");
    return;
  }
   setIsModalOpen(false);

 // await handleSearch(destinationToSearch,startDate,endDate);


    try {
      const res = await axios.get(
        
 `http://localhost:5000/api/search?destination=${destinationToSearch}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      console.log("Itinerary response:", res);

          setItinerary(res.data.itinerary || []);
      setSearchResults(res.data);
      setLocation(destinationToSearch);
      //setItineraryVisible(true);
      navigate("/itinerary", {
      state: {
        itinerary: res.data.itinerary,
        destination: destinationToSearch,
        timeSlots,
      },
    });
    } catch (error) {
      console.error("Search error:", error);
      if (error.response) {
                console.error("Backend error data:", error.response.data);
                console.error("Backend error status:", error.response.status);
        alert(`Failed to fetch itinerary: ${error.response.data.message || error.message}`); // Use template literal for alert
    }else {
                alert("Failed to fetch itinerary. Network error or server not running.");
            }
  };
}



  return (
    <div className="min-h-screen bg-blue-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
       
  <header className="text-center mb-10">
    <h2 className="text-4xl font-bold text-gray-800 mb-2">Where to next?</h2>
    <p className="text-gray-600 text-lg">Search for destinations or browse your favorites</p>

    <div className="mt-6 max-w-xl mx-auto relative flex flex-item">
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Search your dream destination..."
        className="w-full px-5 py-3 pr-28 text-lg border rounded-full shadow-sm focus:ring-2 focus:ring-blue-400"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <button className="bg-blue-200 rounded w-20"
       onClick={() => {
    if (!location) return;
    setDestinationToSearch(location);
    setStartDate(null);
    setEndDate(null);
    setIsModalOpen(true);
  }}
>Search
      </button>
    </div>
  </header>

          <section className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800">Favorite Destinations</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {favoriteDestinations.map((destination, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="text-red-500 text-xl">❤️</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg text-gray-800">{destination.title}</h4>
                    <button
                      onClick={() => {
                        setSelectedDestination(destination.title);
                        setDestinationToSearch(destination.title);
                        setStartDate(null);
                        setEndDate(null);
                        setIsModalOpen(true);
                      }}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-b-md hover:bg-blue-700 transition"
                    >
                      Explore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        
      </div>

      {/* Date Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-6 rounded-lg max-w-md mx-auto mt-40 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Select Travel Dates</h2>

        <div className="mb-4">
          <label className="block mb-1">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {setStartDate(date);
              setEndDate(null);
            }}
            className="border px-3 py-2 w-full"
            minDate={new Date()}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="border px-3 py-2 w-full"
            minDate={startDate || new Date()}
  disabled={!startDate}
          />
        </div>

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleDateConfirm}
        >
          Confirm Dates & Explore
        </button>
      </Modal>
    </div>
  );
}

export default Dashboard;
