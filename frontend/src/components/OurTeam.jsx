import React from "react";
import { FaLinkedinIn, FaGithub,FaEnvelope} from "react-icons/fa";
import tanmay from "../assets/tanmay.jpg";
import medha from "../assets/medha.jpg";
import shruti from "../assets/shruti.jpg";
import mahak from "../assets/mahak.jpg";

const teamMembers=[
    {
        name: "Tanmay Yadav",
        role: "Back-end Developer and Project Manager",
        image: tanmay,
    },
    {
        name:"Medha Pant",
        role:"Front-end Developer and UI Designer",
        image:medha,
    },
    {
        name:"Shruti Ughade",
        role:"UI Designer and System Analyst",
        image: shruti,
    },
    {
        name:"Mahak Mathur",
        role:"Technical Writer and System Analyst",
        image:mahak,
    }
];

export function OurTeam({name,role,image}){
    return(
        <>
        <div className="flex flex-col py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl text-gray-900  font-extrabold">Meet the Minds Behind Wonder Weave ✨ </h1>
            </div>
            <div className="text-center">
                <h2 className="text-2xl text-gray-600">Four brains, one dream - building seamless travel experiences from sketch to screen.</h2>
            </div>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-20">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-8 w-72 text-center hover:scale-105 transition-transform duration-300"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-40 h-40 object-cover rounded-full mx-auto mb-4 border-4 border-gray-100 shadow-sm"
            />
            <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
            <p className="text-base text-gray-800 mb-4 min-h-[48px]">{member.role}</p>
            <div className="flex justify-center gap-5 text-xl text-gray-500">
              <a href="#"><FaLinkedinIn className="hover:text-blue-500" /></a>
              <a href="#"><FaGithub className="hover:text-black" /></a>
              <a href="#"><FaEnvelope className="hover:text-red-500" /></a>
            </div>
          </div>
        ))}
      </div>
    
</>
)
}