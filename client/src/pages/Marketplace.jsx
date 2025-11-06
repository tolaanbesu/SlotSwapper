// src/pages/MarketplaceScreen.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, PRIMARY_GREEN } from '../api';
import { Search, Clock, Zap, X, Send, Calendar, Users, Briefcase, ArrowLeft } from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

const ProposeSwapModal = ({ listing, mySlots, onClose }) => {
  const [selectedSlot, setSelectedSlot] = useState(mySlots[0]?.id || '');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setIsSending(true);
    try {
      await api.post('/swap-request', {
        mySlotId: selectedSlot,
        theirSlotId: listing.id,
      });

      alert('Swap request sent successfully!');
      onClose();
    } catch (error) {
      console.error('Failed to send proposal:', error);
      alert(error.response?.data?.error || 'Failed to send proposal.');
    } finally {
      setIsSending(false);
    }
  };

  const parsedDate = listing.startTime ? parseISO(listing.startTime) : new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
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
              {format(parsedDate, 'h:mm a')} - {format(parseISO(listing.endTime), 'h:mm a')} on {format(parsedDate, 'EEEE, MMM d')}
            </p>
          </div>

          {/* Available Slots Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Slot to Offer</label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-sky-500 focus:border-sky-500"
              required
            >
              {mySlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {format(parseISO(slot.startTime), 'MMM d, h:mm a')} - {format(parseISO(slot.endTime), 'h:mm a')}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
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
            className={`w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-white ${PRIMARY_GREEN} hover:bg-lime-600`}
          >
            {isSending ? 'Sending...' : <><Send className="w-5 h-5 mr-2" /> Propose Swap</>}
          </button>
        </form>
      </div>
    </div>
  );
};

const ListingCard = ({ listing, onPropose }) => {
  const parsedDate = parseISO(listing.startTime);
  const timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col justify-between border border-gray-100 hover:shadow-xl">
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
            {format(parsedDate, 'h:mm a')} - {format(parseISO(listing.endTime), 'h:mm a')}
          </p>
          <p className="flex items-start text-sm pt-2">
            <Users className="w-5 h-5 mr-2 mt-0.5 text-gray-500" />
            <span className="font-medium">Owner: {listing.owner?.name}</span>
          </p>
        </div>
      </div>

      <button
        className={`w-full py-3 mt-4 text-white text-lg font-bold rounded-xl shadow-md ${PRIMARY_GREEN} hover:bg-lime-600`}
        onClick={() => onPropose(listing)}
      >
        Propose Swap
      </button>
    </div>
  );
};

const MarketplaceContent = ({ setPage }) => {
  const [listings, setListings] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeListing, setActiveListing] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [swappableRes, mySlotsRes] = await Promise.all([
          api.get('/swappable-slots'), // slots from other users
          api.get('/events'),          // my slots
        ]);
        setListings(swappableRes.data);
        setMySlots(mySlotsRes.data.filter(e => e.status === 'SWAPPABLE'));
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };
    fetchData();
  }, []);

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-grow flex flex-col">
      <div className="bg-white p-4 md:p-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <button
            onClick={() => setPage('dashboard')}
            className="flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Go Back
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900">Slot Marketplace</h1>
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Search by title or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm font-medium text-gray-600 mb-6">
            Showing {filteredListings.length} available slots.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} onPropose={setActiveListing} />
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="col-span-full border-4 border-dashed border-gray-200 p-12 rounded-xl text-center text-gray-500 mt-4">
              <Zap className="w-12 h-12 mx-auto mb-4" />
              <p className="font-semibold text-lg">No listings found.</p>
              <p className="text-sm">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>

      {activeListing && (
        <ProposeSwapModal
          listing={activeListing}
          mySlots={mySlots}
          onClose={() => setActiveListing(null)}
        />
      )}
    </div>
  );
};

const MarketplaceScreen = ({ setPage }) => {
  const { user } = useAuth();
  if (!user) {
    setPage('login');
    return null;
  }
  return <MarketplaceContent setPage={setPage} />;
};

export default MarketplaceScreen;
