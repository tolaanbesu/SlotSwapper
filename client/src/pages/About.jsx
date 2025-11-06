import { Users, Globe, Rocket, ChevronLeft } from "lucide-react";

export default function About({handleBack}) {

  
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
            {/* Removed the dark radial gradient effect */}

            <div className="relative p-6 md:p-12 bg-white shadow-xl rounded-3xl max-w-5xl w-full">
                
                {/* Back Button */}
                <button 
                    onClick={handleBack} 
                    className="flex items-center text-gray-500 hover:text-green-600 hover:bg-gray-100 transition-colors duration-200 mb-6 p-2 rounded-lg"
                    aria-label="Go back"
                >
                    <ChevronLeft size={24} className="mr-1" />
                    <span className="font-medium text-sm">Back to Home</span>
                </button>

                <h1 className="text-5xl font-extrabold text-green-700 mb-6 text-center md:text-left">
                    About <span className="text-gray-900">SlotSwapper</span>
                </h1>
                
                <div className="w-full h-1 bg-green-600/50 rounded-full mb-8"></div>

                <p className="text-gray-700 text-lg leading-relaxed mb-10">
                    Welcome to <span className="font-bold text-green-600">SlotSwapper</span>, 
                    your dedicated platform revolutionizing time and resource management. 
                    Our core mission is to transform complex scheduling and marketplace dynamics 
                    into a seamless, transparent, and collaborative experience. We empower teams 
                    and individuals to maximize productivity and find perfect alignments with 
                    unmatched efficiency and community-driven trust.
                </p>

                <div className="grid md:grid-cols-3 gap-8 mt-10">
                    
                    {/* Feature 1: Our Team (Green Accent) */}
                    <div className="bg-white p-8 rounded-2xl text-center shadow-md border border-gray-200 transition transform hover:scale-[1.03] hover:bg-green-50 duration-300 ease-in-out">
                        <Users className="mx-auto text-emerald-600 mb-4 bg-gray-100 p-2 rounded-full" size={40} strokeWidth={2} />
                        <h3 className="font-bold text-gray-900 text-xl mb-3">Our Dedicated Team</h3>
                        <p className="text-gray-600 text-base">
                            A collective of passionate engineers, designers, and strategists committed to defining the future of digital productivity tools.
                        </p>
                    </div>

                    {/* Feature 2: Our Vision (Blue Accent) */}
                    <div className="bg-white p-8 rounded-2xl text-center shadow-md border border-gray-200 transition transform hover:scale-[1.03] hover:bg-blue-50 duration-300 ease-in-out">
                        <Globe className="mx-auto text-sky-600 mb-4 bg-gray-100 p-2 rounded-full" size={40} strokeWidth={2} />
                        <h3 className="font-bold text-gray-900 text-xl mb-3">Our Global Vision</h3>
                        <p className="text-gray-600 text-base">
                            To create a globally interconnected ecosystem where every individual can effortlessly trade and manage resources, making time truly flexible.
                        </p>
                    </div>

                    {/* Feature 3: Our Mission (Yellow Accent) */}
                    <div className="bg-white p-8 rounded-2xl text-center shadow-md border border-gray-200 transition transform hover:scale-[1.03] hover:bg-yellow-50 duration-300 ease-in-out">
                        <Rocket className="mx-auto text-amber-600 mb-4 bg-gray-100 p-2 rounded-full" size={40} strokeWidth={2} />
                        <h3 className="font-bold text-gray-900 text-xl mb-3">Our Core Mission</h3>
                        <p className="text-gray-600 text-base">
                            To launch innovative, practical, and secure solutions that turn complex operational logistics into simple, daily actions.
                        </p>
                    </div>
                </div>

                <div className="mt-12 text-center text-gray-500 text-sm border-t border-gray-200 pt-6">
                    &copy; {new Date().getFullYear()} SlotSwapper. All rights reserved.
                </div>
            </div>
        </div>
    );
}