import React from "react";
import { CheckCircle, MapPin, Calendar, Download, Plane, Hotel, Heart } from "lucide-react";

const AppBenefits = () => {
  const benefits = [
    { icon: <Heart className="text-indigo-500" />, title: "All in One Platform", desc: "Plan your entire trip in one place, no more switching between multiple apps." },
    { icon: <MapPin className="text-indigo-500" />, title: "Explore Destinations", desc: "Discover attractions, restaurants, and hotels with live data from trusted APIs." },
    { icon: <Calendar className="text-indigo-500" />, title: "Plan Effortlessly", desc: "Create customized itineraries with drag-and-drop functionality." },
    { icon: <Plane className="text-indigo-500" />, title: "Flight Information", desc: "Check available flights for your travel destination." },
    { icon: <Hotel className="text-indigo-500" />, title: "Stay in Comfort", desc: "Get top hotel recommendations with ratings and photos." },
    { icon: <Download className="text-indigo-500" />, title: "Save as PDF", desc: "Download your travel plan as a PDF to carry offline." },
  ];

  return (
    <div className="bg-gray-50 mt-12">
      {/* App Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose Wonder-Weave?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition duration-300">
              <div className="flex items-center gap-4 mb-4">
                {benefit.icon}
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
              </div>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
<footer className="bg-gray-900 text-white py-8 mt-12">
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex justify-between items-start">
      <div>
        <h4 className="text-lg font-bold mb-4">Wonder-Weave</h4>
        <p className="text-gray-400">
          Your all-in-one travel planner — from destination search to saved itineraries.
        </p>
      </div>

      <div>
        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
        <ul className="space-y-2 text-gray-400">
          <li>
            <a href="/about" className="hover:text-white">About Us</a>
          </li>
          <li>
            <a href="/about" className="hover:text-white">Contact</a>
          </li>
          <li>
            <a href="/terms" className="hover:text-white">Terms & Conditions</a>
          </li>
        </ul>
      </div>
    </div>

    <div className="mt-8 text-center text-gray-500 text-sm">
      © {new Date().getFullYear()} Wonder-Weave. All rights reserved.
    </div>
  </div>
</footer>
</div>
);
}
export default AppBenefits;
