import React from 'react';

// Import local images
import tajmahal from '../assets/tajmahal.jpg';
import varanasi from '../assets/varanasi.jpg';
import udaipur from '../assets/udaipur.jpg';
import kashmir from '../assets/kashmir.jpg';
import kerala from '../assets/kerala.jpg';

// Tourist data
const touristSpots = [
  { name: 'Taj Mahal', location: 'Agra', description: 'A symbol of eternal love.', image: tajmahal },
  { name: 'Varanasi Ghats', location: 'Varanasi', description: 'Sacred rituals on the Ganges.', image: varanasi },
  { name: 'Udaipur', location: 'Udaipur', description: 'Colorful forts and palaces.', image: udaipur},
  { name: 'Kashmir', location: 'Kashmir', description: 'Kashmir Heaven in Earth.', image: kashmir },
  { name: 'Backwaters', location: 'Kerala', description: 'Lush lagoons and houseboats.', image: kerala }
];

export function DestinationNav() {
  return (
    <div className="relative flex flex-col items-center py-16 bg-white">
      {/* SVG Wavy Path */}
      <svg className="absolute left-1/2 -translate-x-1/2 w-2 h-full z-0" viewBox="0 0 2 1000" preserveAspectRatio="none">
        <path d="M1,0 C2,100 0,200 1,300 C2,400 0,500 1,600 C2,700 0,800 1,900" stroke="#7f1d1d" strokeWidth="3" fill="none" />
      </svg>

      {/* Circles and Cards */}
      <div className="space-y-32 relative z-10 w-full max-w-4xl">
        {touristSpots.map((spot, index) => (
          <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : 'flex-row'} justify-between`}>
            {/* Circle */}
            <div className="relative w-4 h-4 bg-red-900 rounded-full z-20" />

            {/* Card */}
            <div className="w-[300px] p-4 bg-white rounded-2xl shadow-md border border-gray-200">
              <img src={spot.image} alt={spot.name} className="rounded-lg mb-2 w-full h-40 object-cover" />
              <h3 className="text-xl font-semibold">{spot.name}</h3>
              <p className="text-sm text-gray-600">{spot.location}</p>
              <p className="text-gray-700 mt-1">{spot.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
