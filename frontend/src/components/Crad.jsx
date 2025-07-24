import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ name, imageUrl }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate(`/destination/${name.toLowerCase()}`);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition relative">
      <div className="relative h-40 overflow-hidden">
        <img
          src={imageUrl || "https://via.placeholder.com/300"}
          alt={name}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-3 right-3">
          <span className="text-red-500 text-xl">❤️</span>
        </div>
      </div>

      <div className="p-4">
        <h4 className="font-bold text-lg text-gray-800">{name}</h4>
        <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={handleExplore}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Explore
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
