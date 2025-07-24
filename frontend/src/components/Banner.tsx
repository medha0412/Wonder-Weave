import React from "react";
import { Link } from "react-router-dom";

export function Banner() {
    return (
        <div className="grid grid-cols-2 px-8 py-6 shadow-sm">
            <div className="bg-blue-100">
                <p className="font-bold text-[60px] grid-span-1 pl-[20%] ">Plan Your Perfect  Journey with <span className="text-blue-600">Ease</span></p>
                <p className="text-2xl w-2/3 mx-auto text-center mt-3">Create, customize, and share your travel itineraries with  our intuitive planner. Your next adventure awaits</p>
                <div className="mt-9 flex gap-4 justify-center">
                    <Link to="/signup">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Plan Your Trip Now</button> </Link>
                   
                </div>
            </div>
            <div className="grid-span-1">
                <img className="h-[500px] w-[700px] " src="./src/assets/banner.jpg" alt="hellow" />
            </div>
        </div>
    )
}