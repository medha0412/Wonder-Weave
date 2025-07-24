import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PlaceCard = ({ place, id }) => {
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
      className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-move"
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-lg font-semibold">{place.name || "Unnamed Place"}</h3>
        {place.time && (
          <span className="text-sm text-blue-600 font-medium">{place.time}</span>
        )}
      </div>
      {place.description && (
        <p className="text-sm text-gray-600">{place.description}</p>
      )}
    </li>
  );
};

export default PlaceCard;
