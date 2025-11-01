import React, { useState } from 'react';
import { MapPin, Mountain, Palmtree, Building2, Heart, Camera, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import beaches from '../assets/beaches.webp'; 
import himachal from '../assets/himachal.jpg';
 import lakes from '../assets/lakes.jpg'; 
 import rajasthan from '../assets/rajasthan.jpg';
  import spiritual from '../assets/spiritual.jpg';
   import wildlife  from '../assets/wildlife.jpg'; 
   import banner1 from '../assets/banner1.png';
export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const handlePlanTrip = () => {
    navigate('/signup');
  };

  const categories = [
    {
      id: 1,
      title: "Heritage & Culture",
      subtitle: "Dive into India's Rich History",
      description: "Explore magnificent palaces, ancient forts, and UNESCO World Heritage sites that tell the story of India's glorious past.",
      destinations: ["Rajasthan", "Agra", "Hampi", "Khajuraho", "Delhi"],
      highlights: ["Majestic forts and palaces", "UNESCO World Heritage sites", "Rich cultural traditions", "Royal architecture", "Historical museums"],
      icon: Building2,
      bgColor: "from-amber-400 to-orange-600",
      image: rajasthan
    },
    {
      id: 2,
      title: "Mountains & Trekking",
      subtitle: "Conquer the Peaks",
      description: "Experience breathtaking Himalayan views, adventurous treks, and serene hill stations perfect for nature lovers.",
      destinations: ["Uttarakhand", "Himachal Pradesh", "Kashmir", "Sikkim", "Ladakh"],
      highlights: ["Himalayan treks", "Snow-capped peaks", "Adventure sports", "Hill stations", "Mountain villages"],
      icon: Mountain,
      bgColor: "from-blue-500 to-indigo-700",
      image: himachal
    },
    {
      id: 3,
      title: "Beaches & Coastlines",
      subtitle: "Sun, Sand & Serenity",
      description: "Relax on pristine beaches, enjoy water sports, and experience coastal culture along India's beautiful shorelines.",
      destinations: ["Goa", "Kerala", "Andaman", "Pondicherry", "Karnataka Coast"],
      highlights: ["Pristine beaches", "Water sports", "Coastal cuisine", "Beach shacks", "Sunset views"],
      icon: Palmtree,
      bgColor: "from-teal-400 to-blue-500",
      image: beaches
    },
    {
      id: 4,
      title: "Spiritual Journeys",
      subtitle: "Find Inner Peace",
      description: "Embark on spiritual quests visiting ancient temples, ashrams, and sacred sites for soul-searching experiences.",
      destinations: ["Varanasi", "Rishikesh", "Haridwar", "Amritsar", "Bodh Gaya"],
      highlights: ["Ancient temples", "Yoga & meditation", "Sacred rituals", "Spiritual teachings", "Peaceful ashrams"],
      icon: Heart,
      bgColor: "from-purple-500 to-pink-600",
      image: spiritual
    },
    {
      id: 5,
      title: "Wildlife & Nature",
      subtitle: "Into the Wild",
      description: "Spot majestic tigers, exotic birds, and diverse wildlife in India's national parks and nature reserves.",
      destinations: ["Jim Corbett", "Ranthambore", "Kaziranga", "Bandipur", "Sundarbans"],
      highlights: ["Tiger safaris", "Bird watching", "Elephant encounters", "Nature photography", "Conservation centers"],
      icon: Camera,
      bgColor: "from-green-500 to-emerald-600",
      image: wildlife
    },
    {
      id: 6,
      title: "Backwaters & Lakes",
      subtitle: "Tranquil Waters",
      description: "Cruise through serene backwaters, stay in houseboats, and enjoy the peaceful beauty of India's water bodies.",
      destinations: ["Kerala Backwaters", "Dal Lake", "Udaipur Lakes", "Kumarakom", "Alleppey"],
      highlights: ["Houseboat stays", "Scenic boat rides", "Floating markets", "Waterside villages", "Ayurvedic spas"],
      icon: MapPin,
      bgColor: "from-cyan-400 to-teal-600",
      image: lakes
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
<div id="experience" className="relative text-white py-20 overflow-hidden">
  <img 
    src={banner1}
    alt="India Tourism Banner"
    className="absolute inset-0 w-full h-full object-cover"
    style={{ imageRendering: 'crisp-edges' }}
  />
  
  <div className="absolute inset-0 bg-black/30"></div>
  
  <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
    <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-2xl">
      Explore India by Experience
    </h1>
    <p className="text-xl opacity-90 mb-8 drop-shadow-xl">
      Discover destinations tailored to your travel style and interests
    </p>
  </div>
</div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className="group cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className={`bg-gradient-to-r ${category.bgColor} p-6 text-white relative overflow-hidden h-48`}>
                    <div className="absolute inset-0">
                      <img 
                        src={category.image} 
                        alt={category.title}
                        className="w-full h-full object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    </div>
                    <div className="relative z-10 h-full flex flex-col justify-end">
                      <IconComponent className="w-8 h-8 mb-3 drop-shadow-lg" />
                      <h3 className="text-xl font-bold mb-2 drop-shadow-lg">{category.title}</h3>
                      <p className="text-sm opacity-90 drop-shadow-lg">{category.subtitle}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-foreground/80 mb-4 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">Top Destinations:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.destinations.slice(0, 3).map((dest, index) => (
                          <span key={index} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                            {dest}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button className="flex items-center text-primary font-medium hover:text-secondary transition group-hover:translate-x-1 transform duration-200">
                      Explore Category 
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className={`bg-gradient-to-r ${selectedCategory.bgColor} text-white p-8 relative h-64 overflow-hidden`}>
                <div className="absolute inset-0">
                  <img 
                    src={selectedCategory.image} 
                    alt={selectedCategory.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20"></div>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl z-20 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center backdrop-blur-sm"
                >
                  ×
                </button>
                <div className="relative z-10 h-full flex flex-col justify-end">
                  <div className="flex items-center mb-4">
                    <selectedCategory.icon className="w-10 h-10 mr-4 drop-shadow-lg" />
                    <div>
                      <h2 className="text-3xl font-bold drop-shadow-lg">{selectedCategory.title}</h2>
                      <p className="text-lg opacity-90 drop-shadow-lg">{selectedCategory.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-lg leading-relaxed drop-shadow-lg">{selectedCategory.description}</p>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Featured Destinations</h3>
                    <div className="space-y-3">
                      {selectedCategory.destinations.map((dest, index) => (
                        <div key={index} className="flex items-center p-3 bg-background rounded-lg hover:bg-background/80 transition">
                          <MapPin className="w-5 h-5 text-primary mr-3" />
                          <span className="font-medium text-foreground">{dest}</span>
                          <div className="ml-auto flex items-center text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4 fill-current" />
                            <Star className="w-4 h-4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">What to Expect</h3>
                    <div className="space-y-3">
                      {selectedCategory.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          <span className="text-foreground">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4 justify-center">
                  <button 
                    onClick={handlePlanTrip}
                    className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition"
                  >
                    Plan Your Trip
                  </button>
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="border border-border bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-background/80 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Start Your Indian Adventure?</h3>
          <p className="text-foreground/80 mb-6 max-w-2xl mx-auto">
            Choose your preferred travel style and let WayOra create the perfect itinerary with
            real-time bookings for flights, hotels, and local experiences.
          </p>
          <button 
            onClick={handlePlanTrip}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition"
          >
            Start Planning with WayOra
          </button>
        </div>
      </div>
    </div>
  );
}