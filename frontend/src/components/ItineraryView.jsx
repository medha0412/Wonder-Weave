import {React,useRef} from "react";
import PlaceCard from "./PlaceCard";
import SortablePlaceCard from "./SortablePlaceCard";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
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
import resto1 from "../assets/resto1.webp";
import hotel from "../assets/hotel.jpg";
import plane from "../assets/plane.png";




const ItineraryView = ({
  onCardClick=()=>{},
  handleDragEnd=()=>{},
  
}) => {
  const location= useLocation();
const { itinerary=[], destination="", timeSlots=[] } = location.state || {};

const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, 
            },
        })
    );
    const typeToImage = {
  Flights: plane,
  Hotels: hotel,
  Restaurants: resto1,
};
const itineraryRef = useRef();

const handleDownloadPDF = () => {
    if(itineraryRef.current){
      html2pdf().set({
      margin: 0.5,
      filename: `Itinerary_${destination}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    }).from(itineraryRef.current).save();

  }  };

  return (
    <div className="px-6  ">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center my-4 pd-5">
        Let's Explore {destination}
      </h2>

      {/* Cards for Flights, Hotels, Restaurants */}
      <div className="flex justify-center gap-4 mb-6">
        {["Flights", "Hotels", "Restaurants"].map((type) => (
          <div
            key={type}
            className="relative w-64 h-40 rounded-xl overflow-hidden shadow-md cursor-pointer transform hover:scale-105 transition"
            onClick={() => onCardClick(type)}
             style={{
        backgroundImage: `url(${typeToImage[type]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
          >
             <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center p-4">
        <h3 className="text-xl font-semibold">{type}</h3>
        <p className="text-sm mt-1">Click to view {type.toLowerCase()}</p>
      </div>
      </div>
              ))}

      </div>

      {/* Itinerary Days in Flex Layout */}
      <div ref={itineraryRef} className="flex flex-wrap gap-6 justify-center">
        {itinerary.map((entry, dayIndex) => {
          const day = Array.isArray(entry) ? entry : entry.places || [];

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
                items={day.map(p => p.xid || `${p.name}-${dayIndex}-${p.id}`)} // Pass only IDs!
                                    strategy={verticalListSortingStrategy}
                                    >
                                      <ul className="space-y-3">
                                        {day.map((place, index) => (
                                            <SortablePlaceCard
                                                key={place.xid || `${place.name}-${dayIndex}-${index}`} // Key for React list rendering
                                                place={place}
                                                time={timeSlots[index]} // Assign time slot based on current index
                                                id={place.xid || `${place.name}-${dayIndex}-${index}`} // Pass a unique ID to SortablePlaceCard
                                            />
                                        ))}
                                    </ul>
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
    