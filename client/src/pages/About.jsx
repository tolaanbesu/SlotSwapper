import React from "react";
import { Users, Globe, Rocket } from "lucide-react";

export default function About() {
  return (
    <div className="p-8 bg-white shadow rounded-2xl max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-green-700 mb-4">About Us</h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        Welcome to <span className="font-semibold text-green-600">SlotSwapper</span>, 
        a dynamic platform designed to simplify slot management and team collaboration. 
        Our mission is to make time management and marketplace swapping effortless, transparent, and efficient.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-green-50 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition">
          <Users className="mx-auto text-green-600 mb-3" size={32} />
          <h3 className="font-semibold text-gray-800 mb-2">Our Team</h3>
          <p className="text-gray-500 text-sm">
            Passionate creators, developers, and innovators working together to redefine productivity.
          </p>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition">
          <Globe className="mx-auto text-blue-600 mb-3" size={32} />
          <h3 className="font-semibold text-gray-800 mb-2">Our Vision</h3>
          <p className="text-gray-500 text-sm">
            Connecting people globally through smarter digital tools that empower daily workflow.
          </p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl text-center shadow-sm hover:shadow-md transition">
          <Rocket className="mx-auto text-yellow-600 mb-3" size={32} />
          <h3 className="font-semibold text-gray-800 mb-2">Our Mission</h3>
          <p className="text-gray-500 text-sm">
            To launch innovative and practical solutions that make every moment count.
          </p>
        </div>
      </div>
    </div>
  );
}
