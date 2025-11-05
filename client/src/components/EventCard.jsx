// import React from 'react';

// export default function EventCard({ event, onToggle, onEdit, onDelete }) {
//   return (
//     <div className="p-4 bg-white rounded-lg shadow">
//       <h3 className="font-semibold text-lg">{event.title}</h3>
//       <p className="text-sm text-gray-600">
//         {new Date(event.startTime).toLocaleString()} — {new Date(event.endTime).toLocaleString()}
//       </p>
//       <div className="mt-2 flex items-center justify-between">
//         <span className="text-sm text-gray-500">{event.status}</span>
//         <div className="flex gap-2">
//           {onToggle && <button onClick={() => onToggle(event)} className="px-2 py-1 text-sm rounded bg-green-600 text-white">Toggle</button>}
//           {onEdit && <button onClick={() => onEdit(event)} className="px-2 py-1 text-sm rounded border">Edit</button>}
//           {onDelete && <button onClick={() => onDelete(event)} className="px-2 py-1 text-sm rounded bg-red-600 text-white">Delete</button>}
//         </div>
//       </div>
//     </div>
//   );
// }



import { Clock, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";

export default function EventCard({ event, onToggle, onDelete }) {
  const isSwappable = event.status === "SWAPPABLE";
  const isPending = event.status === "SWAP_PENDING";

  const statusColor = isSwappable ? "bg-green-100 text-green-700" : isPending ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700";
  const statusText = isSwappable ? "Swappable" : isPending ? "Pending" : "Busy";

  const time = `${format(parseISO(event.startTime), "hh:mm a")} - ${format(parseISO(event.endTime), "hh:mm a")}`;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start gap-4 mb-3">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{event.title}</p>
        <p className="text-sm text-gray-500 flex items-center mt-1">
          <Clock className="w-3 h-3 mr-1" /> {time}
        </p>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <div className="flex space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor}`}>{statusText}</span>
          {!isPending && (
            <button
              onClick={() => onToggle(event)}
              className={`px-3 py-1 text-sm font-semibold rounded-lg transition ${isSwappable ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
            >
              {isSwappable ? "Set Busy" : "Make Swappable"}
            </button>
          )}
          <button onClick={() => onDelete(event)} className="p-1 rounded-full text-gray-400 hover:text-red-500 transition" title="Delete Event">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

