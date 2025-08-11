import React from 'react';
import { Mail, Linkedin, Github, User, Award, Code, Heart } from 'lucide-react';
import medha from "../assets/medha.jpg"
export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Wonder Weave</h1>
          <p className="text-xl opacity-90">Making travel planning effortless, one journey at a time</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <User className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-800">Meet the Developer</h2>
            </div>
            
            <div className="flex-shrink-0">
            <div className="w-40 h-40 rounded-full border-2 border-blue-200 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                <img 
                  src={medha} 
                  alt="Medha Pant" 
                  className="w-full h-full object-cover rounded-full"
                    style={{ 
                    objectPosition: 'center center',
                    imageRendering: 'crisp-edges',
                    filter: 'none'
                  }}                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full flex items-center justify-center text-blue-400" style={{ display: 'none' }}>
                  <User className="w-12 h-12" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Hi! I'm <span className="font-semibold text-blue-600">Medha Pant</span>, a passionate Computer Science student 
              and software developer. As someone who loves both technology and travel, I noticed how frustrating it could be 
              to plan the perfect trip.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              The constant juggling between multiple websites for flights, hotels, restaurants, and itinerary planning 
              inspired me to create a solution that brings everything together in one seamless platform.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Heart className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">The Vision Behind Wonder Weave</h2>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Wonder Weave was born from a simple idea: <span className="font-semibold">travel planning shouldn't be overwhelming</span>. 
              Instead of jumping between countless websites and apps, travelers deserve a unified experience where they can:
            </p>
            
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>Search and discover destinations effortlessly</li>
              <li>Get personalized itineraries with detailed day-by-day plans</li>
              <li>Find hotels, restaurants, and attractions with real-time data</li>
              <li>Have a pre-planned roadmap for their entire journey</li>
            </ul>
            
            <p className="text-gray-700 leading-relaxed">
              With Wonder Weave, you'll know exactly what to do and when to do it, making your travel experience 
              smooth and memorable from start to finish.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <Code className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Built with Modern Technology</h2>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Wonder Weave is built using the <span className="font-semibold text-blue-600">MERN Stack</span> 
              (MongoDB, Express.js, React, Node.js) to ensure a fast, responsive, and scalable experience.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              The platform integrates real-time APIs to provide up-to-date information on itineraries, hotels, 
              restaurants, and travel options, ensuring you always have access to the latest data for your travel planning.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-8 mb-12">
          <div className="flex items-center mb-4">
            <Award className="w-8 h-8 text-yellow-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Recognition</h2>
          </div>
          
          <p className="text-gray-700 text-lg leading-relaxed">
            Wonder Weave was selected as a <span className="font-semibold text-yellow-700">finalist</span> in our 
            college's prestigious <span className="font-semibold">Project Expo</span> competition, standing out among 
            <span className="font-semibold"> 70 innovative projects</span>. This recognition validates the platform's 
            potential to revolutionize travel planning for users worldwide.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Get in Touch</h2>
          
          <p className="text-gray-700 text-center mb-8 text-lg">
            I'd love to hear your feedback, suggestions, or just connect with fellow travel enthusiasts and developers!
          </p>
          
          <div className="flex justify-center space-x-8">
            <a
              href="mailto:medhapant4@gmail.com"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition group"
            >
              <Mail className="w-8 h-8 text-blue-600 group-hover:text-blue-700 mb-2" />
              <span className="text-gray-700 font-medium">Email</span>
            </a>
            
            <a
              href="https://linkedin.com/in/medhapant4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition group"
            >
              <Linkedin className="w-8 h-8 text-blue-600 group-hover:text-blue-700 mb-2" />
              <span className="text-gray-700 font-medium">LinkedIn</span>
            </a>
            
            <a
              href="https://github.com/medha0412"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition group"
            >
              <Github className="w-8 h-8 text-blue-600 group-hover:text-blue-700 mb-2" />
              <span className="text-gray-700 font-medium">GitHub</span>
            </a>
            
            <a
              href="https://medhapant.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition group"
            >
              <User className="w-8 h-8 text-blue-600 group-hover:text-blue-700 mb-2" />
              <span className="text-gray-700 font-medium">Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}