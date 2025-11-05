// import React, { useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";

// const API = import.meta.env.VITE_API_URL;

// export default function Requests() {
//   const { token } = useAuth();
//   const [incoming, setIncoming] = useState([]);
//   const [outgoing, setOutgoing] = useState([]);
//   const [message, setMessage] = useState(null);

//   const fetchRequests = useCallback(async () => {
//     try {
//       const res = await axios.get(`${API}/requests`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setIncoming(res.data.incoming || []);
//       setOutgoing(res.data.outgoing || []);
//     } catch (err) {
//       console.error("Error loading requests:", err);
//       alert("Failed to load requests");
//     }
//   }, [token]); // ✅ Dependency

//   // ✅ useEffect with proper dependency
//   useEffect(() => {
//     if (token) fetchRequests();
//   }, [fetchRequests, token]);

//   // ✅ Handle response action
//   async function handleResponse(id, accept) {
//     try {
//       await axios.post(
//         `${API}/swap-response/${id}`,
//         { accept },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setMessage(`Request ${accept ? "accepted" : "rejected"}.`);
//       fetchRequests(); // reload after responding
//     } catch (err) {
//       console.error("Error responding:", err);
//       setMessage("Failed to process request");
//     }
//   }

//   return (
//     <div>
//       <h1 className="text-2xl font-bold mb-4">Swap Requests</h1>

//       {message && (
//         <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">{message}</div>
//       )}

//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Incoming Requests */}
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Incoming</h2>
//           {incoming.length === 0 ? (
//             <p className="text-gray-500">No incoming requests.</p>
//           ) : (
//             incoming.map((req) => (
//               <div
//                 key={req.id}
//                 className="bg-white p-4 rounded shadow mb-3 flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-medium">
//                     From: {req.sender?.name ?? "Unknown"}
//                   </p>
//                   <p className="text-sm text-gray-500">Status: {req.status}</p>
//                 </div>

//                 {req.status === "PENDING" && (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleResponse(req.id, true)}
//                       className="px-3 py-1 bg-green-600 text-white rounded"
//                     >
//                       Accept
//                     </button>
//                     <button
//                       onClick={() => handleResponse(req.id, false)}
//                       className="px-3 py-1 bg-red-600 text-white rounded"
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>

//         {/* Outgoing Requests */}
//         <div>
//           <h2 className="text-xl font-semibold mb-2">Outgoing</h2>
//           {outgoing.length === 0 ? (
//             <p className="text-gray-500">No outgoing requests.</p>
//           ) : (
//             outgoing.map((req) => (
//               <div
//                 key={req.id}
//                 className="bg-white p-4 rounded shadow mb-3 flex justify-between items-center"
//               >
//                 <div>
//                   <p className="font-medium">
//                     To: {req.receiver?.name ?? "Unknown"}
//                   </p>
//                   <p className="text-sm text-gray-500">Status: {req.status}</p>
//                 </div>
//                 {req.status === "PENDING" && (
//                   <span className="text-yellow-600 text-sm">Pending</span>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import AppLayout from '../components/Layout/Applayout';
import { PRIMARY_GREEN, PRIMARY_BLUE, PRIMARY_RED } from '../api';
import { Zap, Clock, User, Check, X, Send } from 'lucide-react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

const MOCK_REQUESTS = [
    { id: 101, type: 'received', status: 'Pending', targetSlot: '11:00 AM - 12:00 PM', targetDate: '2025-11-10T11:00:00Z', proposedSlot: '1:00 PM - 2:00 PM', proposer: 'Jane Smith', timestamp: new Date(Date.now() - 3600000) },
    { id: 102, type: 'sent', status: 'Accepted', targetSlot: '3:00 PM - 4:00 PM', targetDate: '2025-11-08T15:00:00Z', proposedSlot: '10:00 AM - 11:00 AM', proposer: 'You', timestamp: new Date(Date.now() - 86400000 * 2) },
    { id: 103, type: 'received', status: 'Rejected', targetSlot: '9:00 AM - 10:00 AM', targetDate: '2025-11-12T09:00:00Z', proposedSlot: '12:00 PM - 1:00 PM', proposer: 'Alex Brown', timestamp: new Date(Date.now() - 86400000 * 5) },
];

const RequestCard = ({ request }) => {
    // Convert timestamp to Date object for date-fns
    const parsedTimestamp = request.timestamp instanceof Date ? request.timestamp : parseISO(request.timestamp);
    const parsedTargetDate = request.targetDate instanceof Date ? request.targetDate : parseISO(request.targetDate);

    const isPending = request.status === 'Pending';
    const isSent = request.type === 'sent';

    const statusClasses = {
        Pending: 'bg-yellow-100 text-yellow-700',
        Accepted: 'bg-lime-100 text-lime-700',
        Rejected: 'bg-red-100 text-red-700',
    };

    const handleAction = (action) => {
        // Mock action handler for demo
        console.log(`${action} request ${request.id}`);
        // In a real app: call API to update request status
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
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[request.status]}`}>
                    {request.status}
                </span>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
                <p className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Target Slot:</span>
                    <span className="font-semibold text-gray-800">{request.targetSlot} on {format(parsedTargetDate, 'MMM d, yyyy')}</span>
                </p>
                <p className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Proposed Slot:</span>
                    <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded-lg">{request.proposedSlot}</span>
                </p>
                <p className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{isSent ? 'Sent to' : 'From'}: <span className="font-semibold">{request.proposer}</span></span>
                </p>
                <p className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(parsedTimestamp, { addSuffix: true })}
                    </span>
                </p>
            </div>

            {isPending && request.type === 'received' && (
                <div className="mt-5 pt-4 border-t border-gray-100 flex space-x-3">
                    <button
                        className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg text-white ${PRIMARY_GREEN} hover:bg-lime-600 transition`}
                        onClick={() => handleAction('Accept')}
                    >
                        <Check className="w-4 h-4 mr-2" /> Accept
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center py-2 text-sm font-semibold rounded-lg text-white ${PRIMARY_RED} hover:bg-red-600 transition`}
                        onClick={() => handleAction('Reject')}
                    >
                        <X className="w-4 h-4 mr-2" /> Reject
                    </button>
                </div>
            )}
            
            {isPending && request.type === 'sent' && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                    <button
                        className="w-full flex items-center justify-center py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                        onClick={() => handleAction('Cancel')}
                    >
                        <X className="w-4 h-4 mr-2" /> Cancel Request
                    </button>
                </div>
            )}
        </div>
    );
};


const RequestsContent = () => {
    // In a real app, replace MOCK_REQUESTS with an API fetch using useEffect
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [filter, setFilter] = useState('All'); // All | Pending | Accepted | Rejected

    const filteredRequests = requests.filter(req => 
        filter === 'All' || req.status === filter
    );

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

    const totalRequests = requests.length;
    const pendingCount = requests.filter(r => r.status === 'Pending').length;
    const acceptedCount = requests.filter(r => r.status === 'Accepted').length;

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
                <button className={`px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-md transition ${PRIMARY_BLUE} hover:bg-sky-700 flex items-center`}>
                    <Send className="w-4 h-4 mr-2" /> Send New Request
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map(req => (
                    <RequestCard key={req.id} request={req} />
                ))}

                {filteredRequests.length === 0 && (
                    <div className="col-span-full border-4 border-dashed border-gray-200 p-12 rounded-xl text-center text-gray-500 mt-4">
                        <Zap className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-semibold text-lg">No {filter.toLowerCase()} requests found.</p>
                        <p className="text-sm">Requests will appear here after they are sent or received.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const RequestsScreen = ({ currentPage, setPage }) => (
    <AppLayout currentPage={currentPage} setPage={setPage}>
        <RequestsContent />
    </AppLayout>
);

export default RequestsScreen;
