
// src/pages/MarketplaceScreen.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PRIMARY_BLUE, PRIMARY_GREEN, PRIMARY_RED, LIGHT_BLUE_ACTIVE, LIGHT_GREEN_ACTIVE } from '../api';
import { Search, MapPin, Clock, Zap, X, Send, Calendar, Users, Briefcase,ArrowLeft } from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

const MOCK_MARKETPLACE = [
    { id: 201, title: 'Morning Stand-up Slot', date: '2025-11-15T09:00:00Z', startTime: '9:00 AM', endTime: '9:30 AM', tags: ['Team', 'Urgent'], owner: 'Michael A.', reason: 'Need to attend dentist.', status: 'Available' },
    { id: 202, title: 'Client Demo Prep', date: '2025-11-10T14:00:00Z', startTime: '2:00 PM', endTime: '3:00 PM', tags: ['Client', 'Flexible'], owner: 'Sarah B.', reason: 'Have a conflicting internal meeting.', status: 'Available' },
    { id: 203, title: 'Focus Time', date: '2025-11-18T10:00:00Z', startTime: '10:00 AM', endTime: '11:00 AM', tags: ['Solo', 'Flexible'], owner: 'Admin User', reason: 'Moving this to late afternoon.', status: 'Available' },
];

const MOCK_AVAILABLE_SLOTS = [
    { id: 's1', time: '9:30 AM - 10:30 AM (Nov 15)' },
    { id: 's2', time: '4:00 PM - 5:00 PM (Nov 15)' },
    { id: 's3', time: '1:00 PM - 2:00 PM (Nov 16)' },
];


const ProposeSwapModal = ({ listing, onClose }) => {
    const [selectedSlot, setSelectedSlot] = useState(MOCK_AVAILABLE_SLOTS[0].id);
    const [message, setMessage] = useState('');
     // Assume token is needed for the real API call
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedSlot) return;

        setIsSending(true);
        try {
            // In a real app: 
            // await api.post('/requests/propose', {
            //     listingId: listing.id,
            //     proposedSlotId: selectedSlot,
            //     message: message,
            // });
            
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API delay
            console.log(`Swap proposed for listing ${listing.id}. Proposed slot: ${selectedSlot}`);
            
            onClose(); // Close on success
        } catch (error) {
            console.error("Failed to send proposal:", error);
            // This is a mock response, use a custom modal for real apps
            alert("Failed to send proposal. Please try again."); 
        } finally {
            setIsSending(false);
        }
    };

    const parsedDate = listing.date instanceof Date ? listing.date : parseISO(listing.date);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl transform scale-100 transition duration-300">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Propose a Swap</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="border border-gray-200 p-4 rounded-xl bg-gray-50">
                        <p className="font-semibold text-lg text-gray-800 flex items-center">
                            <Zap className="w-5 h-5 mr-2 text-sky-600" />
                            Listing: {listing.title}
                        </p>
                        <p className="text-sm text-gray-600 ml-7">
                            {listing.startTime} - {listing.endTime} on {format(parsedDate, 'EEEE, MMM d')}
                        </p>
                    </div>

                    {/* Available Slots Selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Slot to Offer
                        </label>
                        <select
                            value={selectedSlot}
                            onChange={(e) => setSelectedSlot(e.target.value)}
                            className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-sky-500 focus:border-sky-500 transition"
                            required
                        >
                            {MOCK_AVAILABLE_SLOTS.map(slot => (
                                <option key={slot.id} value={slot.id}>
                                    {slot.time}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-2">
                            Select one of your available slots to propose a swap.
                        </p>
                    </div>

                    {/* Optional Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message (Optional)
                        </label>
                        <textarea
                            rows="3"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="I can cover your slot, and this is why I need the time..."
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-sky-500 focus:border-sky-500 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSending}
                        className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-white ${PRIMARY_GREEN} hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition duration-300 disabled:opacity-50`}
                    >
                        {isSending ? 'Sending...' : <><Send className="w-5 h-5 mr-2" /> Propose Swap</>}
                    </button>
                </form>
            </div>
        </div>
    );
};


const ListingCard = ({ listing, onPropose }) => {
    // Convert date string to Date object
    const parsedDate = listing.date instanceof Date ? listing.date : parseISO(listing.date);

    const timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true });

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between border border-gray-100 transition duration-300 hover:shadow-xl">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-extrabold text-gray-900">{listing.title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {timeAgo}
                    </div>
                </div>

                <div className="space-y-2 text-gray-700 mb-4">
                    <p className="flex items-center text-base font-semibold text-sky-700">
                        <Calendar className="w-5 h-5 mr-2" />
                        {format(parsedDate, 'EEEE, MMM d')}
                    </p>
                    <p className="flex items-center text-sm">
                        <Clock className="w-5 h-5 mr-2 text-gray-500" />
                        {listing.startTime} - {listing.endTime}
                    </p>
                    <p className="flex items-start text-sm pt-2">
                        <Users className="w-5 h-5 mr-2 mt-0.5 text-gray-500" />
                        <span className="font-medium">Owner: {listing.owner}</span>
                    </p>
                    <p className="flex items-start text-sm">
                        <Briefcase className="w-5 h-5 mr-2 mt-0.5 text-gray-500" />
                        <span className="text-gray-600 italic line-clamp-2">Reason: {listing.reason}</span>
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4 pt-2 border-t border-gray-100">
                    {listing.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-sky-50 text-sky-700">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <button
                className={`w-full py-3 mt-4 text-white text-lg font-bold rounded-xl shadow-md transition ${PRIMARY_GREEN} hover:bg-lime-600`}
                onClick={() => onPropose(listing)}
            >
                Propose Swap
            </button>
        </div>
    );
};


const MarketplaceContent = ({ setPage }) => {
    // In a real app, replace MOCK_MARKETPLACE with an API fetch using useEffect
    const [listings, setListings] = useState(MOCK_MARKETPLACE.map(l => ({ ...l, date: parseISO(l.date) })));
    const [searchTerm, setSearchTerm] = useState('');
    const [activeListing, setActiveListing] = useState(null);

    const filteredListings = listings.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="flex-grow flex flex-col">
            {/* Header / Search Bar */}
            <div className="bg-white p-4 md:p-6 shadow-sm sticky top-0 z-10">
             
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

                    {/* Go Back Button */}
                   <button
                      onClick={() => setPage('dashboard')}
                      className="flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 mb-2 md:mb-0"
                  >
                      <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
                  </button> 
                    <h1 className="text-3xl font-extrabold text-gray-900">Slot Marketplace</h1>
                    <div className="w-full md:w-80 relative">
                        <input
                            type="text"
                            placeholder="Search by title, owner, or tag..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Listings Grid */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    <p className="text-sm font-medium text-gray-600 mb-6">
                        Showing {filteredListings.length} available slots ({searchTerm ? `filtered by "${searchTerm}"` : 'all'}).
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredListings.map(listing => (
                            <ListingCard 
                                key={listing.id} 
                                listing={listing} 
                                onPropose={setActiveListing}
                            />
                        ))}

                        {filteredListings.length === 0 && (
                            <div className="col-span-full border-4 border-dashed border-gray-200 p-12 rounded-xl text-center text-gray-500 mt-4">
                                <Zap className="w-12 h-12 mx-auto mb-4" />
                                <p className="font-semibold text-lg">No listings match your search.</p>
                                <p className="text-sm">Try broadening your search criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {activeListing && (
                <ProposeSwapModal 
                    listing={activeListing} 
                    onClose={() => setActiveListing(null)} 
                />
            )}
        </div>
    );
};

// Unlike other pages, Marketplace does NOT use AppLayout because it has its own custom header/search bar
const MarketplaceScreen = ({ currentPage, setPage }) => {
    // Ensure that if the user somehow navigates here, the sidebar item is still highlighted
    // Note: MarketplaceScreen does not use AppLayout, but it needs setPage to trigger navigation
    const { user } = useAuth();
    if (!user) {
        setPage('login'); // Force redirect if unauthenticated
        return null;
    }
    return <MarketplaceContent setPage={setPage} />;
};

export default MarketplaceScreen;
