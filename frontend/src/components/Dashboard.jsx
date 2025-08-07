import React, { useState,useEffect } from "react";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

//import SortablePlaceCard from "./SortablePlaceCard";
//import PlaceCard from "./PlaceCard";
//import ItineraryView from "./ItineraryView";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from 'react-toastify';
import {
  useNavigate,
  useLocation,
  useNavigationType
} from "react-router-dom";

import { ConfirmLeaveModal } from "./ConfirmLeaveModal";

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
  const routeLocation = useLocation();
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
  const [flights,setFlights] = useState([]);
  const[isFlyable, setIsFlyable]=useState(true);
  const [itineraryStatus, setItineraryStatus] = useState("idle");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  
  const navigate = useNavigate();
  useEffect(() => {
  setItineraryStatus("idle");
}, []);
useEffect(() => {
  if (routeLocation.state?.fromLogin && routeLocation.state?.userName) {
    toast.success(`Welcome, ${routeLocation.state.userName}! 👋`);
  }
}, [routeLocation.state?.fromLogin, routeLocation.state?.userName]);
useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; 
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
const navigationType = useNavigationType();


  const handleLeaveConfirm = () => {
  setShowLeaveModal(false);
  
    navigate('/', { replace: true }); 
  
};

const handleLeaveCancel = () => {
  setShowLeaveModal(false);
  
};

  

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
        setItineraryStatus("loading");
    try {
        const res = await axios.get(
            `http://localhost:5000/api/search?destination=${destinationToSearch}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        );
        console.log("Itinerary response:", res);

        const { itinerary, isFlyable, hotels, restaurants } = res.data;
       setItineraryStatus("success");
        navigate("/itinerary", {
            state: {
                itinerary,
                destination: destinationToSearch,
                timeSlots,
                isFlyable,
                hotels,        // Now passing hotels
                restaurants,   // Now passing restaurants
            },
        });
    } catch (error) {
        console.error("Search error:", error);
        setItineraryStatus("error");
        if (error.response) {
            console.error("Backend error data:", error.response.data);
            console.error("Backend error status:", error.response.status);
            alert(`Failed to fetch itinerary: ${error.response.data.message || error.message}`);
        } else {
            alert("Failed to fetch itinerary. Network error or server not running.");
        }
    }
};



  return (
    <div className="min-h-screen bg-blue-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
      {itineraryStatus === "loading" && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-3">
      <div className="text-xl font-semibold">✈️ Creating your itinerary...</div>
      <div className="text-gray-600">Please wait while we plan your trip.</div>
      <div className="loader mx-auto"></div>
    </div>
  </div>
)}

{itineraryStatus === "error" && (
  <div className="text-red-600 font-semibold mt-4 text-center">
    ❌ Failed to generate itinerary. Try a different destination.
  </div>
)}
  <header className="text-center mb-10">
    <div className="flex items-center justify-between mr-5 ml-auto ">
        {/* The back button is on the left */}
        <button 
            onClick={() => setShowLeaveModal(true)} 
            className="flex items-center px-4 py-2 text-blue-600 text-xl font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
            >
                <path 
                    fillRule="evenodd" 
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                />
            </svg>
            Go Back
        </button>

        {/* The main heading is in the center */}
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Where to next?
        </h2>
        
        {/* This is a spacer element to push the heading to the center */}
        <div className="h-5 w-24"></div>
    </div>

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
      <button className="bg-blue-200 rounded w-10 h-10 flex items-center justify-center mt-2 transition-transform duration-200 hover:scale-110"
       onClick={() => {
    if (!location) return;
    setDestinationToSearch(location);
    setStartDate(null);
    setEndDate(null);
    setIsModalOpen(true);
  }}
>  <FaSearch className="text-gray-700 text-xl" />

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
      <ConfirmLeaveModal
  isOpen={showLeaveModal}
  onConfirm={handleLeaveConfirm}
  onCancel={handleLeaveCancel}
/>

    </div>
  );
}

export default Dashboard;
