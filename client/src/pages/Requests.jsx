
import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '../components/Layout/Applayout';
import { PRIMARY_GREEN, PRIMARY_BLUE, PRIMARY_RED } from '../api';
import { Zap, Clock, User, Check, X, Send } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import {api} from '../api'; 
import { useAuth } from '../context/AuthContext';

const RequestCard = ({ request, onAction }) => {
  const parsedTimestamp = request.createdAt
    ? parseISO(request.createdAt)
    : new Date();
  const isPending = request.status === 'PENDING';
  const isSent = request.type === 'sent';

  const statusClasses = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    ACCEPTED: 'bg-lime-100 text-lime-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
      <div className="flex justify-between items-start mb-4 border-b pb-4">
        <div className="flex items-center space-x-3">
          <Zap className={`w-5 h-5 ${isSent ? 'text-sky-600' : 'text-lime-600'}`} />
          <h3 className="font-bold text-lg text-gray-900">
            {isSent ? 'Sent Request' : 'Received Request'}
          </h3>
        </div>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            statusClasses[request.status] || ''
          }`}
        >
          {request.status}
        </span>
      </div>

      <div className="space-y-3 text-sm text-gray-700">
        <p className="flex justify-between items-center">
          <span className="font-medium text-gray-600">My Slot:</span>
          <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded-lg">
            {request.mySlot?.title || '—'}
          </span>
        </p>
        <p className="flex justify-between items-center">
          <span className="font-medium text-gray-600">Their Slot:</span>
          <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded-lg">
            {request.theirSlot?.title || '—'}
          </span>
        </p>
        <p className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-500" />
          <span>
            {isSent ? 'To' : 'From'}:{' '}
            <span className="font-semibold">
              {isSent ? request.receiver?.name : request.sender?.name}
            </span>
          </span>
        </p>
        <p className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(parsedTimestamp, { addSuffix: true })}
          </span>
        </p>
      </div>

      {/* Action Buttons */}
      {isPending && !isSent && (
        <div className="mt-5 pt-4 border-t border-gray-100 flex space-x-3">
          <button
            className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg text-white ${PRIMARY_GREEN} hover:bg-lime-600 transition`}
            onClick={() => onAction(request.id, true)}
          >
            <Check className="w-4 h-4 mr-2" /> Accept
          </button>
          <button
            className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg text-white ${PRIMARY_RED} hover:bg-red-600 transition`}
            onClick={() => onAction(request.id, false)}
          >
            <X className="w-4 h-4 mr-2" /> Reject
          </button>
        </div>
      )}

      {isPending && isSent && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <button
            className="w-full flex items-center justify-center py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
            onClick={() => onAction(request.id, 'cancel')}
          >
            <X className="w-4 h-4 mr-2" /> Cancel Request
          </button>
        </div>
      )}
    </div>
  );
};

const RequestsContent = ({setPage}) => {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();



  const fetchRequests = useCallback(async () => {
  if (!token) return;

  try {
    setLoading(true);
    const { data } = await api.get('/requests', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allRequests = [
      ...data.incoming.map((r) => ({ ...r, type: 'received' })),
      ...data.outgoing.map((r) => ({ ...r, type: 'sent' })),
    ];
    setRequests(allRequests);
  } catch (err) {
    console.error('Error fetching requests:', err);
  } finally {
    setLoading(false);
  }
}, [token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

async function handleAction(id, action) {
  if(!token) return;

  try {
    if(action === 'cancel') {
      // Call the new cancel endpoint
      await api.post(
        `/swap-cancel/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await api.post(
        `/swap-response/${id}`,
        { accept: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    await fetchRequests();
  } catch (err) {
    console.error('Failed to update request:', err);
  }
}



  const filteredRequests =
    filter === 'All'
      ? requests
      : requests.filter((r) => r.status === filter.toUpperCase());

  const totalRequests = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length;
  const acceptedCount = requests.filter((r) => r.status === 'ACCEPTED').length;

  const RequestSummary = ({ title, count, color, filterValue }) => (
    <div
      className={`p-5 rounded-xl shadow-lg cursor-pointer transition transform hover:scale-[1.02] ${
        filter === filterValue ? `${color} text-white` : 'bg-white text-gray-800 hover:shadow-xl'
      }`}
      onClick={() => setFilter(filterValue)}
    >
      <p className="text-3xl font-extrabold">{count}</p>
      <p className="font-semibold text-sm mt-1">{title}</p>
    </div>
  );

 

  return (
    <div className="flex-grow p-4 md:p-8 overflow-y-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Slot Swap Requests</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <RequestSummary title="All Requests" count={totalRequests} color={PRIMARY_BLUE} filterValue="All" />
        <RequestSummary title="Pending" count={pendingCount} color={PRIMARY_GREEN} filterValue="Pending" />
        <RequestSummary title="Accepted" count={acceptedCount} color={PRIMARY_GREEN} filterValue="Accepted" />
        <RequestSummary title="Rejected" count={totalRequests - pendingCount - acceptedCount} color={PRIMARY_RED} filterValue="Rejected" />
      </div>

      {/* Request List */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {filter} Requests ({filteredRequests.length})
        </h2>
        <button
        className={`px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-md transition ${PRIMARY_BLUE} hover:bg-sky-700 flex items-center`}
        onClick={() => setPage('marketplace')} 
      >
        <Send className="w-4 h-4 mr-2" /> Send New Request
      </button>
      </div>

      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => (
            <RequestCard key={req.id} request={req} onAction={handleAction} />
          ))}

          {filteredRequests.length === 0 && (
            <div className="col-span-full border-4 border-dashed border-gray-200 p-12 rounded-xl text-center text-gray-500 mt-4">
              <Zap className="w-12 h-12 mx-auto mb-4" />
              <p className="font-semibold text-lg">No {filter.toLowerCase()} requests found.</p>
              <p className="text-sm">Requests will appear here after they are sent or received.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const RequestsScreen = ({ currentPage, setPage }) => (
  <AppLayout currentPage={currentPage} setPage={setPage}>
    <RequestsContent setPage={setPage}/>
  </AppLayout>
);

export default RequestsScreen;

