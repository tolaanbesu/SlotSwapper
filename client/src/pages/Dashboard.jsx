// src/pages/DashboardScreen.jsx
import React, { useState, useEffect } from 'react';
import AppLayout from '../components/Layout/Applayout';
import { PRIMARY_BLUE, PRIMARY_GREEN } from '../api'; // Import 'api' for real data fetching
import { useAuth } from '../context/AuthContext'; 
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, getDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

const MOCK_DASHBOARD_EVENTS = [
    { id: 1, title: 'Team Sync Up', startTime: new Date(), endTime: new Date(Date.now() + 60 * 60 * 1000), status: 'Busy', swappable: false },
    { id: 2, title: 'Project Deep Dive', startTime: new Date(Date.now() + 120 * 60 * 1000), endTime: new Date(Date.now() + 180 * 60 * 1000), status: 'Free', swappable: true },
];

const DashboardContent = ({ setPage }) => {
    const { token } = useAuth();
    const [events, setEvents] = useState(MOCK_DASHBOARD_EVENTS.map(e => ({
        ...e,
        startTime: e.startTime,
        endTime: e.endTime,
    }))); // Using mock data temporarily for the UI, replace with real fetch
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const today = new Date();
    const currentMonth = startOfMonth(today);

    // Fetch real data on component mount
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchEvents = async () => {
            setLoading(true);
            setError(null);
            try {
                // Adjust this endpoint to match your server's events endpoint
                // const response = await api.get('/schedule/my-events');
                
                // IMPORTANT: In a real app, use the line above. We're using MOCK_DASHBOARD_EVENTS here
                // only to ensure the UI renders correctly until you implement the backend.
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
                const responseData = MOCK_DASHBOARD_EVENTS;

                const fetchedEvents = responseData.map(event => ({
                    ...event,
                    // Assume event.startTime/endTime are Date objects in mock, or ISO strings from API.
                    startTime: event.startTime instanceof Date ? event.startTime : parseISO(event.startTime), 
                    endTime: event.endTime instanceof Date ? event.endTime : parseISO(event.endTime),
                }));
                setEvents(fetchedEvents);

            } catch (err) {
                console.error("Error fetching dashboard events:", err);
                // setError("Failed to load events. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        // fetchEvents(); // Commented out to prevent immediate failed Axios calls to localhost:5000/api/schedule/my-events
    }, [token]);


    // Helper to determine the month grid (remains the same)
    const startDay = startOfMonth(currentMonth);
    const endDay = endOfMonth(currentMonth);
    const calendarDays = eachDayOfInterval({ start: startDay, end: endDay });

    const firstDayOfWeek = getDay(startDay); // 0 (Sun) to 6 (Sat)
    const paddingStart = Array.from({ length: firstDayOfWeek }).fill(null);

    const todayEvents = events.filter(event => isSameDay(event.startTime, today));

    const DayTile = ({ date, isToday, isCurrentMonth = true }) => {
        if (!date) {
            return <div className="p-1"></div>;
        }
        return (
            <div className={`p-1 flex items-center justify-center rounded-lg font-semibold text-sm cursor-pointer transition duration-150
                ${isToday ? PRIMARY_BLUE + ' text-white' : isCurrentMonth ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-400'}
            `}>
                {format(date, 'd')}
            </div>
        );
    };

    const EventCard = ({ event }) => (
        <div className="p-4 bg-white rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center transition duration-300 hover:shadow-xl">
            <div className="flex-grow mb-3 sm:mb-0">
                <div className="text-sm text-gray-600">{format(event.startTime, 'h:mm a')} - {format(event.endTime, 'h:mm a')}</div>
                <h3 className="font-bold text-lg text-gray-900">{event.title}</h3>
            </div>
            <div className="flex flex-wrap items-center space-y-2 sm:space-y-0 sm:space-x-3 ml-0 sm:ml-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${event.status === 'Busy' ? 'bg-red-100 text-red-600' : 'bg-lime-100 text-lime-600'}`}>
                    {event.status}
                </span>
                {event.swappable ? (
                    <button className={`px-4 py-2 text-white text-sm font-semibold rounded-lg transition ${PRIMARY_GREEN}`} onClick={() => setPage('marketplace')}>
                        Make Swappable
                    </button>
                ) : (
                    <button className="px-4 py-2 text-gray-700 text-sm font-semibold border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        View Details
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex-grow p-4 md:p-8 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">My Schedule</h1>
                <div className="flex space-x-2">
                    <button className="hidden sm:inline-flex px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition">Calendar View</button>
                    <button className="hidden sm:inline-flex px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition">List View</button>
                    <button className={`px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-md transition ${PRIMARY_BLUE}`}>
                        + Create New Event
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Calendar */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <button className="p-1 rounded-full hover:bg-gray-100"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
                        <h2 className="font-bold text-lg">{format(currentMonth, 'MMMM yyyy')}</h2>
                        <button className="p-1 rounded-full hover:bg-gray-100"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                            <div key={day} className="text-sm font-medium text-gray-500">{day}</div>
                        ))}
                        {/* Calendar Days */}
                        {paddingStart.map((_, i) => <DayTile key={`pad-${i}`} />)}
                        {calendarDays.map((date, i) => (
                            <DayTile
                                key={i}
                                date={date}
                                isToday={isSameDay(date, today)}
                                isCurrentMonth={true}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Column - Events */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Events for {format(today, 'MMMM d')}</h2>
                    {loading && <p className="text-gray-500">Loading events...</p>}
                    {error && <p className="text-red-500 font-semibold">{error}</p>}
                    
                    {!loading && !error && (
                        <div className="space-y-4">
                            {todayEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}

                            {todayEvents.length === 0 && (
                                <div className="border-4 border-dashed border-gray-200 p-12 rounded-xl text-center text-gray-500 mt-8">
                                    <Calendar className="w-12 h-12 mx-auto mb-4" />
                                    <p className="font-semibold text-lg">No more events for today</p>
                                    <p className="text-sm">You have no other events scheduled for {format(today, 'MMMM d')}. Create one to get started!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const DashboardScreen = ({ currentPage, setPage }) => (
    <AppLayout currentPage={currentPage} setPage={setPage}>
        <DashboardContent setPage={setPage} />
    </AppLayout>
);

export default DashboardScreen;



// import React, { useState, useEffect, useCallback } from "react";
// import { Calendar, List, Plus } from "lucide-react";
// import axios from "axios";
// import { format, isSameDay, parseISO } from "date-fns";

// import { useAuth } from "../context/AuthContext";
// import { useMessage } from "../hooks/useMessage";

// import CalendarWidget from "../components/CalendarWidget";
// import EventCard from "../components/EventCard";
// import CreateEventModal from "../components/CreateEventModal";
// import MessageModal from "../components/MessageModal";
// import Sidebar from "../components/Layout/Sidebar";

// const API = "http://localhost:5000/api";

// export default function ScheduleView() {
//   const { token } = useAuth();
//   const { message, showAlert, showConfirm, handleConfirm } = useMessage();

//   const [events, setEvents] = useState([]);
//   const [form, setForm] = useState({ title: "", startTime: "", endTime: "" });
//   const [loading, setLoading] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   const fetchEvents = useCallback(async () => {
//     if (!token) return;
//     try {
//       const res = await axios.get(`${API}/events`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setEvents(res.data || []);
//     } catch (err) {
//       console.error(err);
//       showAlert("Failed to load events.");
//     }
//   }, [token, showAlert]);

//   useEffect(() => {
//     fetchEvents();
//   }, [fetchEvents]);

//   const selectedEvents = events
//     .filter((ev) => isSameDay(parseISO(ev.startTime), selectedDate))
//     .sort((a, b) => parseISO(a.startTime) - parseISO(b.startTime));

//   const createEvent = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API}/events`, form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setForm({ title: "", startTime: "", endTime: "" });
//       setIsModalOpen(false);
//       showAlert("Event created successfully!");
//       fetchEvents();
//     } catch (err) {
//       console.error(err);
//       showAlert("Failed to create event.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleStatus = async (ev) => {
//     try {
//       const newStatus = ev.status === "SWAPPABLE" ? "BUSY" : "SWAPPABLE";
//       await axios.put(
//         `${API}/events/${ev.id}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchEvents();
//     } catch (err) {
//       console.error(err);
//       showAlert("Failed to update event status.");
//     }
//   };

//   const del = async (ev) => {
//     const confirmed = await showConfirm("Are you sure you want to delete this event?");
//     if (!confirmed) return;
//     try {
//       await axios.delete(`${API}/events/${ev.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       showAlert("Event deleted successfully.");
//       fetchEvents();
//     } catch (err) {
//       console.error(err);
//       showAlert("Failed to delete event.");
//     }
//   };

//   return (
//     <div className="p-8 md:p-10 lg:pl-72 w-full min-h-screen bg-gray-50">
//       <div className="flex justify-between items-center mb-6 pt-4">
//         <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
//         <div className="flex space-x-3 items-center">
//           <button className="px-4 py-2 border rounded-lg flex items-center text-sm font-medium bg-gray-200 text-gray-800">
//             <Calendar className="w-4 h-4 mr-2" /> Calendar View
//           </button>
//           <button className="px-4 py-2 border rounded-lg flex items-center text-sm font-medium text-gray-500 hover:bg-gray-100">
//             <List className="w-4 h-4 mr-2" /> List View
//           </button>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center text-sm"
//           >
//             <Plus className="w-4 h-4 mr-2" /> Create New Event
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <CalendarWidget
//           currentMonth={currentMonth}
//           selectedDate={selectedDate}
//           onDateSelect={setSelectedDate}
//           onMonthChange={setCurrentMonth}
//           events={events}
//         />
//         <div className="lg:col-span-2">
//           <h2 className="text-xl font-bold mb-4 text-gray-800">
//             Upcoming Events for {format(selectedDate, "MMMM do")}
//           </h2>
//           <div className="min-h-[300px] flex flex-col">
//             {selectedEvents.length > 0
//               ? selectedEvents.map((ev) => (
//                   <EventCard key={ev.id} event={ev} onToggle={toggleStatus} onDelete={del} />
//                 ))
//               : (
//                 <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-white flex flex-col items-center justify-center text-gray-500">
//                   <Calendar className="w-12 h-12 mb-4 text-gray-400" />
//                   <p className="text-lg font-semibold">No events today</p>
//                   <button onClick={() => setIsModalOpen(true)} className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
//                     Create one to get started.
//                   </button>
//                 </div>
//               )}
//           </div>
//         </div>
//       </div>

//       <CreateEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} form={form} setForm={setForm} createEvent={createEvent} loading={loading} />
//       <MessageModal message={message} handleConfirm={handleConfirm} />
//       <Sidebar />
//     </div>
//   );
// }
