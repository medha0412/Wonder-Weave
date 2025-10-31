import React, { useState,useEffect,useCallback } from "react";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";
import Modal from "react-modal";
import axios from "axios";
import { api } from "../utils/api";
import { FaSearch } from "react-icons/fa";
import { MapPin, Star } from "lucide-react";
import { useBlocker } from "../hooks/useBlocker";
import { Link } from "react-router-dom";

import { toast } from 'react-toastify';
import { useRef } from "react";
import {
  useNavigate,
  useLocation,
  useNavigationType
} from "react-router-dom";

import { ConfirmLeaveModal } from "./ConfirmLeaveModal";


// Images
import rishi from "../assets/rishi.jpg";
import ladakh from "../assets/ladakh.jpg";
import manali from "../assets/manali.jpg";
import goa from "../assets/goa.jpg";
import mathura from "../assets/mathura.jpg";
import kedarnath from "../assets/kedarnath.jpg";
import varansi from "../assets/varanasi3.jpg";
import mumbai from "../assets/mumbai.jpg";

Modal.setAppElement("#root");

const favoriteDestinations = [
  {
    title: "Rishikesh",
    image: rishi,
    region: "Uttarakhand, India",
    rating: 4.9,
    description: "Spiritual gateway with yoga and meditation",
  },
  {
    title: "Ladakh",
    image: ladakh,
    region: "Jammu & Kashmir, India",
    rating: 4.8,
    description: "High-altitude desert with stunning vistas",
  },
  {
    title: "Manali",
    image: manali,
    region: "Himachal Pradesh, India",
    rating: 4.9,
    description: "Adventure hub nestled in the Himalayas",
  },
  {
    title: "Kedarnath",
    image: kedarnath,
    region: "Uttarakhand, India",
    rating: 4.8,
    description: "Sacred pilgrimage site with alpine beauty",
  },
  {
    title: "Varanasi",
    image: varansi,
    region: "Uttar Pradesh, India",
    rating: 4.7,
    description: "Ancient spiritual city on the Ganges",
  },
  {
    title: "Mumbai",
    image: mumbai,
    region: "Maharashtra, India",
    rating: 4.6,
    description: "Vibrant coastal metropolis with culture",
  },
  {
    title: "Mathura",
    image: mathura,
    region: "Uttar Pradesh, India",
    rating: 4.7,
    description: "Birthplace of Lord Krishna with heritage",
  },
  {
    title: "Goa",
    image: goa,
    region: "Goa, India",
    rating: 4.8,
    description: "Tropical paradise with beaches and culture",
  },
];
const majorCities = [
  'Kasol',
  'Nainital', 
  'Bangalore',
  'Pune',
  'Mussoorie',
  'Indore'
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
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [userName, setUserName] = useState("Traveler");
  const [nextAction, setNextAction] = useState(null);
  const [shouldNavigateBack, setShouldNavigateBack] = useState(false);
  const [shouldBlockNavigation, setShouldBlockNavigation] = useState(true);
  const [pendingRedirect, setPendingRedirect] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");
  const navigate = useNavigate();
 
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      setPendingNavigation(() => () => navigate("/")); 
      setShowLeaveModal(true);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const handleCustomBack = () => {
    setPendingNavigation(() => () => navigate("/"));
    setShowLeaveModal(true);
  };

  const confirmLeave = () => {
    setShowLeaveModal(false);
    if (pendingNavigation) {
      pendingNavigation();
    }
  };
const cancelLeave = () => {
  setShowLeaveModal(false);
  setPendingNavigation(null);
  window.history.pushState(null, "", location.pathname); 
};

  useEffect(() => {
  if (!shouldBlockNavigation && pendingRedirect) {
    navigate("/itinerary", {
      state: {
        itinerary,
        destination: destinationToSearch,
        timeSlots,
        isFlyable,
        hotels,
        restaurants,
      },
    });
  }
}, [shouldBlockNavigation, pendingRedirect]);


  useEffect(() => {
  setItineraryStatus("idle");
}, []);

 const blocker = useCallback((proceed) => {
    setShowLeaveModal(true);
    setNextAction(() => proceed); 
  }, []);

  


const navigationType = useNavigationType();
  useEffect(() => {
  const name =
    routeLocation.state?.userName ||
    location.state?.userName ||
    localStorage.getItem("userName") ||
    "Traveler";

  const fromLogin = routeLocation.state?.fromLogin || localStorage.getItem("showWelcome") === "true";

  if (fromLogin) {
    toast.success(`Welcome, ${name}! 👋`);

    setUserName(name);
    setShowWelcomePopup(true);

   
    setTimeout(() => {
      setShowWelcomePopup(false);
      localStorage.removeItem("showWelcome");
    }, 3000);
  }
}, []);



  

const handleSearch = () => {
  if (!location) return;
  setDestinationToSearch(location);
  setStartDate(null);
  setEndDate(null);
  setIsModalOpen(true);
  setShowDropdown(false);
};
const handleCitySelect = (city) => {
  setLocation(city);
  setShowDropdown(false);
  setDestinationToSearch(city);
  setStartDate(null);
  setEndDate(null);
  setIsModalOpen(true);
};

const handleInputFocus = () => {
  setShowDropdown(true);
};

useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);




  

console.log("Dashboard component rendered.");
  console.log("searchResults:", searchResults);

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
    const formattedStart = startDate.toISOString().split('T')[0]; 
    const formattedEnd = endDate.toISOString().split('T')[0]; 
    
    setFormattedStartDate(formattedStart);
    setFormattedEndDate(formattedEnd);
    setIsModalOpen(false);
        setItineraryStatus("loading");

    try {
       console.log("Sending dates:", { formattedStart, formattedEnd });
       
        const res = await axios.get(
          api(`/search?destination=${destinationToSearch}&startDate=${formattedStart}&endDate=${formattedEnd}`)
        );
        console.log("Itinerary response:", res);

        const { itinerary, isFlyable, hotels, restaurants } = res.data;
       setItineraryStatus("success");
        setShouldBlockNavigation(false); 
            setPendingRedirect(true);
        setIsFlyable(isFlyable);
          setHotels(hotels);
         setRestaurants(restaurants);
          setItinerary(itinerary);

      
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
useEffect(() => {
  if (!shouldBlockNavigation && pendingRedirect) {
    navigate("/itinerary", {
      state: {
        itinerary,
        destination: destinationToSearch,
        startDate: formattedStartDate, 
        endDate: formattedEndDate, 
        timeSlots,
        isFlyable,
        hotels,
        restaurants,
      },
    });
  }
}, [shouldBlockNavigation, pendingRedirect, formattedStartDate, formattedEndDate]);
useEffect(() => {
  setShouldBlockNavigation(true); 
}, []);



  return (
    <>
    {showWelcomePopup && (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50">
    👋 Welcome, {userName}!
  </div>
)}

    <div className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="max-w-7xl mx-auto">
      {itineraryStatus === "loading" && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-3">
      <div className="text-xl font-semibold">✈️ Creating your itinerary...</div>
      <div className="text-gray-900">Your dream vacation is brewing… Hotels are being polished, restaurants are cooking, and flights are taking off!</div>
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
    <div className="relative flex items-center justify-between w-full px-6 mt-6">
  {/* Left: Go Back */}
  <button 
    onClick={handleCustomBack}
    className="flex items-center px-4 py-2 text-primary hover:text-secondary transition-colors font-medium rounded z-10"
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

  <h2 className="absolute left-1/2 transform -translate-x-1/2 text-4xl sm:text-5xl font-serif font-bold text-foreground">Where to next?</h2>
  <div className="text-primary hover:text-secondary transition-colors font-medium z-10">
    <Link to="/save">Your Trips →</Link>
  </div>
</div>
    <p className="text-muted-foreground text-lg">Search for destinations or browse your favorites</p>

    <div className="mt-6 max-w-xl mx-auto relative" ref={dropdownRef}>
  <div className="relative flex items-center">
    <input
      ref={inputRef}
      type="text"
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      onFocus={handleInputFocus}
      placeholder="Search your dream destination..."
      className="w-full px-6 py-4 pr-28 text-base rounded-full bg-white border-2 border-accent/30 placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors shadow-sm"
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearch();
        }
        if (e.key === "Escape") {
          setShowDropdown(false);
        }
      }}
    />
    <button 
      className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary hover:bg-secondary text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
      onClick={handleSearch}
    >  
      <FaSearch className="text-white text-base" />
    </button>
  </div>

  {showDropdown && (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
      <div className="p-3 border-b bg-background">
        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Popular Destinations
        </h3>
      </div>
      <div className="py-2">
        {majorCities.map((city, index) => (
          <button
            key={index}
            onClick={() => handleCitySelect(city)}
            className="w-full px-4 py-3 text-left hover:bg-primary/5 focus:bg-primary/5 focus:outline-none transition-colors duration-150 flex items-center gap-3 group"
          >
            <MapPin className="w-4 h-4 text-foreground/40 group-hover:text-primary" />
            <span className="text-foreground group-hover:text-primary">{city}</span>
          </button>
        ))}
      </div>
    </div>
  )}
</div>
  </header>

          <section className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif font-bold text-foreground">Favorite Destinations</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {favoriteDestinations.map((destination, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-accent/10"
                >
                  <div className="relative h-40 overflow-hidden bg-muted">
                    <img
                      src={destination.image}
                      alt={destination.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className="text-red-500 text-xl">❤️</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-lg text-foreground mb-1">{destination.title}</h4>
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                      <MapPin size={16} className="text-primary" />
                      <span>{destination.region}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{destination.description}</p>
                    <div className="flex items-center gap-1 mb-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(destination.rating) ? "fill-accent text-accent" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-foreground ml-1">{destination.rating}</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedDestination(destination.title);
                        setDestinationToSearch(destination.title);
                        setStartDate(null);
                        setEndDate(null);
                        setIsModalOpen(true);
                      }}
                      className="w-full bg-primary hover:bg-secondary text-white px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                    >
                      Explore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-6 rounded-lg max-w-md mx-auto mt-40 shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-semibold mb-4">Select Travel Dates</h2>

        <div className="mb-4">
          <label className="block mb-1 text-foreground">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => {setStartDate(date);
              setEndDate(null);
            }}
            className="w-full px-4 py-2 rounded-md bg-white border-2 border-accent/30 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            calendarClassName="!bg-white !rounded-lg !border !border-border !p-2 !text-foreground"
            dayClassName={(date) => {
              const today = new Date();
              today.setHours(0,0,0,0);
              return date < today
                ? "!text-foreground/30 !cursor-not-allowed hover:!bg-transparent !rounded-md"
                : "!text-foreground hover:!bg-primary/10 !rounded-md";
            }}
            weekDayClassName={() => "!text-foreground/60"}
            popperClassName="!z-50"
            minDate={new Date()}
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-foreground">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            className="w-full px-4 py-2 rounded-md bg-white border-2 border-accent/30 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
            calendarClassName="!bg-white !rounded-lg !border !border-border !p-2 !text-foreground"
            dayClassName={(date) => {
              const min = startDate ? new Date(startDate.setHours(0,0,0,0)) : new Date();
              const day = new Date(date);
              day.setHours(0,0,0,0);
              return day < min
                ? "!text-foreground/30 !cursor-not-allowed hover:!bg-transparent !rounded-md"
                : "!text-foreground hover:!bg-primary/10 !rounded-md";
            }}
            weekDayClassName={() => "!text-foreground/60"}
            popperClassName="!z-50"
            minDate={startDate || new Date()}
  disabled={!startDate}
          />
        </div>

        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
          onClick={handleDateConfirm}
        >
          Confirm Dates & Explore
        </button>
      </Modal>
      <ConfirmLeaveModal
  isOpen={showLeaveModal}
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
/>
    </div>  
  </>
  );
}

export default Dashboard;
