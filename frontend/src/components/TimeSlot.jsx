import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const TimeSlotColumn = ({ day, time, places, activeDrag }) => {
  // Container id example: "day1-9:00 AM"
  const containerId = `${day}-${time}`;

  return (
    <div className="mb-6">
      <h5 className="text-md font-semibold mb-2">{time}</h5>
      <ul className="min-h-[100px] bg-gray-50 rounded-lg p-2 border border-gray-200">
        {places.length === 0 && (
          <li className="text-gray-400 text-sm italic">No places</li>
        )}
        {places.map((place, index) => (
          <SortablePlaceCard
            key={place.id}
            id={`${day}-${time}-${place.id}`}
            place={place}
          />
        ))}
      </ul>
    </div>
  );
};

const SortablePlaceCard = ({ id, place }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white p-3 rounded-xl shadow hover:shadow-lg cursor-move mb-2"
    >
      <h3 className="font-semibold">{place.name || "Unnamed Place"}</h3>
      {place.description && (
        <p className="text-xs text-gray-600">{place.description}</p>
      )}
    </li>
  );
};

export default TimeSlotColumn;
