// src/pages/DashboardScreen.jsx 
import { useState, useEffect } from 'react';
import AppLayout from '../components/Layout/Applayout';
import { PRIMARY_BLUE, PRIMARY_GREEN, api, setAuthToken } from '../api';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, getDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths, isSameMonth } from 'date-fns';
import CreateEventModal from '../components/CreateEventModal';

const DashboardContent = () => {
    const { token } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState('calendar');
    const [isOpen, setIsOpen] = useState(false);
    const [editEvent, setEditEvent] = useState(null); 

    // Fetch events from backend
    useEffect(() => {
    if (!token) return;
    setAuthToken(token)

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/events');
            const fetchedEvents = res.data.map(ev => ({
                ...ev,
                startTime: ev.startTime instanceof Date ? ev.startTime : parseISO(ev.startTime),
                endTime: ev.endTime instanceof Date ? ev.endTime : parseISO(ev.endTime),
                swappable: ev.status === 'SWAPPABLE'
            }));
            setEvents(fetchedEvents);
        } catch (err) {
            console.error("Error fetching dashboard events:", err);
            setError("Failed to load events.");
        } finally {
            setLoading(false);
        }
    };

    fetchEvents();
}, [token]);

    const toggleSwappable = async (ev) => {
        try {
            const newStatus = ev.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
            await api.put(`/events/${ev.id}`, { status: newStatus });
            setEvents(events.map(e => e.id === ev.id ? { ...e, status: newStatus, swappable: newStatus === 'SWAPPABLE' } : e));
        } catch (err) {
            console.error("Failed to update event status:", err);
            alert("Failed to update event status.");
        }
    };



    const handleDeleteEvent = async (eventId) => {
        try {
            await api.delete(`/events/${eventId}`);
            setEvents(events.filter(event => event.id !== eventId)); // Remove event from state
        } catch (err) {
            console.error("Failed to delete event:", err);
            alert("Failed to delete event.");
        }
    };

 
    const handleEditEvent = (event) => {
    setEditEvent(event);  
    setIsOpen(true);      
    };

    // Calendar controls
    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

    const startDay = startOfMonth(currentMonth);
    const endDay = endOfMonth(currentMonth);
    const calendarDays = eachDayOfInterval({ start: startDay, end: endDay });
    const firstDayOfWeek = getDay(startDay);
    const paddingStart = Array.from({ length: firstDayOfWeek }).fill(null);

    const filteredEvents = events.filter(event => isSameDay(event.startTime, selectedDate));

    const DayTile = ({ date, isToday, isCurrentMonth = true }) => {
        if (!date) return <div className="p-1"></div>;
        const hasEvent = events.some(e => isSameDay(e.startTime, date));
        const isSelected = isSameDay(date, selectedDate);
        return (
            <div
                onClick={() => setSelectedDate(date)}
                className={`p-1 flex flex-col items-center justify-center rounded-lg font-semibold text-sm cursor-pointer transition duration-150 
                    ${isSelected ? PRIMARY_BLUE + ' text-white' 
                        : isToday ? 'bg-blue-50 text-blue-700' 
                        : isCurrentMonth ? 'text-gray-900 hover:bg-gray-100' 
                        : 'text-gray-400'}
                `}
            >
                {format(date, 'd')}
                {hasEvent && <div className={`w-1.5 h-1.5 mt-0.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`}></div>}
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
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${event.status === 'BUSY' ? 'bg-red-100 text-red-600' : 'bg-lime-100 text-lime-600'}`}>
                    {event.status}
                </span>
                <button
                    className={`px-4 py-2 text-white text-sm font-semibold rounded-lg transition ${PRIMARY_GREEN}`}
                    onClick={() => toggleSwappable(event)}
                >
                    {event.swappable ? 'Make Busy' : 'Make Swappable'}
                </button>
                <button
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                    onClick={() => handleEditEvent(event)}
                >
                    Edit
                </button>
                <button
                    className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteEvent(event.id)}
                >
                    Delete
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex-grow p-4 md:p-8 overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">My Schedule</h1>
                <div className="flex space-x-2">
                    <button
                        className={`hidden sm:inline-flex px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition ${view === 'calendar' ? 'bg-gray-200' : 'hover:bg-gray-50'}`}
                        onClick={() => setView('calendar')}
                    >
                        Calendar View
                    </button>
                    <button
                        className={`hidden sm:inline-flex px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg transition ${view === 'list' ? 'bg-gray-200' : 'hover:bg-gray-50'}`}
                        onClick={() => setView('list')}
                    >
                        List View
                    </button>
                    <button
                        className={`px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-md transition ${PRIMARY_BLUE}`}
                        onClick={() => {
                            setEditEvent(null); // Clear edit event for new event creation
                            setIsOpen(true);
                        }}
                    >
                        + Create New Event
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {view === 'calendar' && (
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100">
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h2 className="font-bold text-lg">{format(currentMonth, 'MMMM yyyy')}</h2>
                            <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100">
                                <ChevronRight className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                <div key={`${day}-${index}`} className="text-sm font-medium text-gray-500">{day}</div>
                            ))}
                            {paddingStart.map((_, i) => <DayTile key={`pad-${i}`} />)}
                            {calendarDays.map((date, i) => (
                                <DayTile key={i} date={date} isToday={isSameDay(date, new Date())} isCurrentMonth={isSameMonth(date, currentMonth)} />
                            ))}
                        </div>
                    </div>
                )}

                <div className={view === 'calendar' ? 'lg:col-span-2' : 'lg:col-span-3'}>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {view === 'calendar'
                            ? `Events for ${format(selectedDate, 'MMMM d')}`
                            : 'All Events'}
                    </h2>
                    {loading && <p className="text-gray-500">Loading events...</p>}
                    {error && <p className="text-red-500 font-semibold">{error}</p>}

                    {!loading && !error && (
                        <div className="space-y-4">
                            {(view === 'calendar' ? filteredEvents : events).length > 0 ? (
                                (view === 'calendar' ? filteredEvents : events).map(event => (
                                    <EventCard key={event.id} event={event} />
                                ))
                            ) : (
                                <div className="border-4 border-dashed border-gray-200 p-12 rounded-xl text-center text-gray-500 mt-8">
                                    <Calendar className="w-12 h-12 mx-auto mb-4" />
                                    <p className="font-semibold text-lg">No events</p>
                                    <p className="text-sm">You have no events scheduled for this day.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <CreateEventModal 
                        isOpen={isOpen}
                        onclose={()=>setIsOpen(false)}
                        event={editEvent}
                    />
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







