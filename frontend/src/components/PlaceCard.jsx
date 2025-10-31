import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const PlaceCard = ({ place, time }) => {
  const [clock, period] = (time || "").split(" ");

  return (
    <li className="grid grid-cols-[auto,1fr] items-center gap-6 cursor-grab w-full">
      {/* Time bubble */}
      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-foreground text-foreground shadow-md flex flex-col items-center justify-center bg-background">
        <span className="text-xs sm:text-sm font-bold leading-none">{clock || "--:--"}</span>
        <span className="text-[9px] sm:text-[11px] font-semibold tracking-wide">{period || ""}</span>
      </div>

      {/* Card */}
      <div className="w-full bg-white rounded-2xl border border-border shadow-sm hover:shadow-lg transition p-6">
        <h3 className="text-lg font-serif font-bold text-foreground">{place.name || "Unnamed Place"}</h3>
        {place.description && (
          <p className="text-sm text-foreground/70 mt-2">{place.description}</p>
        )}
      </div>
    </li>
  );
};

export default PlaceCard;
