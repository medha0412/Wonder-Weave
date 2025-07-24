import React from 'react';
import tajmahal from '../assets/tajmahal.jpg'
import varanasi from '../assets/varanasi.jpg'
import kerala from '../assets/kerala.jpg'
import uttarakhand from '../assets/uttarakhand.jpg'
import kashmir from '../assets/kashmir.jpg'
import darjeeling from '../assets/darjeeling.jpg'
const destinations = [
  {
    title: 'Taj Mahal, Agra',
    description: 'One of the seven wonders of the world, a symbol of eternal love.',
    image: tajmahal,
  },
  {
    title: 'Varanasi Ghats',
    description: 'Ancient spiritual city with sacred rituals along the Ganges River.',
    image: varanasi,
  },
  {
    title: 'Kerala Backwaters',
    description: 'A tropical paradise known for its serene backwaters and lush greenery',
    image: kerala,
  },
  {
    title: 'Uttarakhand ',
    description: 'A Himalayan heaven offering spiritual retreats, scenic hill stations, and thrilling adventures.',
    image: uttarakhand,
  },
  {
    title: 'Pahalgam , Kashmir ',
    description: 'Heaven on Earth with snow-capped peaks, pristine lakes, and breathtaking valleys',
    image: kashmir,
  },
  {
    title: 'Darjeeling Tea Gardens',
    description: "The ‘Queen of the Hills’, famous for its tea gardens, toy train, and majestic views of Kanchenjunga.",
    image: darjeeling,
  },
];

export function Destinations() {
  return (
    <section className="px-6 py-10 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {destinations.map((place, index) => (
          <div key={index} className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src={place.image}
              alt={place.title}
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4">
              <h2 className="text-lg font-bold">{place.title}</h2>
              <p className="text-sm">{place.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
