import React, { useState } from "react";
import axios from "axios";
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
import PlaceCard from "./PlaceCard";
import { useNavigate } from "react-router-dom";

// Images
import udaipur from "../assets/udaipur.jpg";
import ladakh from "../assets/ladakh.jpg";
import manali from "../assets/manali.jpg";
import goa from "../assets/goa.jpg";
import mathura from "../assets/mathura.jpg";
import kedarnath from "../assets/kedarnath.jpg";
import ujjain from "../assets/ujjain.jpg";
import mumbai from "../assets/mumbai.jpg";

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
  const [location, setLocation] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [draggablePlaces, setDraggablePlaces] = useState([]); // array of 3 day-arrays

  const navigate = useNavigate();
  const sensors = useSensors(useSensor(PointerSensor));

  // Unified search function: accepts destination string
  const handleSearch = async (dest) => {
    const destinationToSearch = dest || location;
    if (!destinationToSearch) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/search?destination=${destinationToSearch}`
      );
      setSearchResults(res.data);
      setLocation(destinationToSearch); // update location state for input box

      if (res.data.places) {
        const sliced = res.data.places.slice(0, 15);
        const days = [];

        for (let i = 0; i < 3; i++) {
          const dayPlaces = sliced.slice(i * 5, (i + 1) * 5).map((place, index) => ({
            id: `day-${i + 1}-place-${index}`,
            ...place,
            time: timeSlots[index],
          }));
          days.push(dayPlaces);
        }

        setDraggablePlaces(days);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleDragEnd = (event, dayIndex) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = draggablePlaces[dayIndex].findIndex((p) => p.id === active.id);
    const newIndex = draggablePlaces[dayIndex].findIndex((p) => p.id === over.id);

    const updatedDay = arrayMove(draggablePlaces[dayIndex], oldIndex, newIndex);

    // Re-assign time slots based on new order:
    const updatedDayWithTimes = updatedDay.map((place, idx) => ({
      ...place,
      time: timeSlots[idx] || "",
    }));

    const newDraggablePlaces = [...draggablePlaces];
    newDraggablePlaces[dayIndex] = updatedDayWithTimes;

    setDraggablePlaces(newDraggablePlaces);
  };

  // Button click handler example
  const handleSaveItinerary = () => {
    alert("Itinerary saved!");
  };

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Where to next?</h2>
          <p className="text-gray-600 text-lg">Search for destinations or browse your favorites</p>

          <div className="mt-6 max-w-xl mx-auto relative">
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
            <button
              onClick={() => handleSearch()}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 text-sm"
            >
              Search
            </button>
          </div>
        </header>

        {/* Search Results */}
        {searchResults && (
          <div className="mb-16 max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">
              Itinerary for "{location}"
            </h3>

            {draggablePlaces.length > 0 ? (
              <div className="space-y-8">
                {draggablePlaces.map((dayList, dayIndex) => (
                  <div key={dayIndex}>
                    <h4 className="text-xl font-bold mb-4 text-blue-700">Day {dayIndex + 1}</h4>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => handleDragEnd(event, dayIndex)}
                    >
                      <SortableContext
                        items={dayList.map((p) => p.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <ul className="space-y-4">
                          {dayList.map((place) => (
                            <PlaceCard key={place.id} id={place.id} place={place} />
                          ))}
                        </ul>
                      </SortableContext>
                    </DndContext>
                  </div>
                ))}

                {/* Save Itinerary Button */}
                <div className="mt-6 text-center">
                  <button
                    onClick={handleSaveItinerary}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    Save Itinerary
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No places found.</p>
            )}

            {/* Flights */}
            {searchResults.flights && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-2">Flights</h4>
                {searchResults.flights.length > 0 ? (
                  <ul className="space-y-2">
                    {searchResults.flights.map((flight, index) => (
                      <li key={index} className="bg-gray-100 p-3 rounded">
                        {flight.airline} - {flight.price?.amount || "N/A"} INR
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No flights found.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Favorite Destinations */}
        <section className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">Favorite Destinations</h3>
            <a href="#" className="text-blue-600 text-sm hover:underline">
              View all
            </a>
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
                    onClick={() => handleSearch(destination.title)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
