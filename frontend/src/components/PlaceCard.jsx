import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PlaceCard = ({ place, time }) => {
  
  return (
    <li
      className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-grab" // Changed cursor to grab
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-semibold">{place.name || "Unnamed Place"}</h3>
        {time && (
          <span className="text-sm text-blue-600 font-medium">{time}</span>
        )}
      </div>
      {place.description && (
        <p className="text-sm text-gray-600">{place.description}</p>
      )}
    </li>
  );
};

export default PlaceCard;
