// components/Events/CreateEventModal.jsx
// import { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import { api } from '../api';
// import { useAuth } from '../context/AuthContext';
// import {format} from 'date-fns'

// export default function CreateEventModal({ isOpen, onclose, event }) { // Accept event prop
  
//   const { token } = useAuth();
//   const [form, setForm] = useState({
//     title: "",
//     startTime: "",
//     endTime: "",
//     status: "BUSY",
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   useEffect(() => {
//     if (event) { // If editing, set form to event values
//       setForm({
//         title: event.title,
//         startTime: format(event.startTime, 'yyyy-MM-ddTHH:mm'), // Adjust for input format
//         endTime: format(event.endTime, 'yyyy-MM-ddTHH:mm'),
//         status: event.status,
//       });
//     } else {
//       setForm({ title: "", startTime: "", endTime: "", status: "BUSY" }); // Reset form
//     }
//   }, [event]);

//   const onClose = () => {
//     setMessage(null);
//     setForm({ title: "", startTime: "", endTime: "", status: "BUSY" });
//     onclose();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null);

//     if (token) {
//       api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     }
    
//     try {
//       if (event) {
//         // Update existing event
//         await api.put(`/events/${event.id}`, form);
//         setMessage("✅ Event updated successfully!");
//       } else {
//         // Create new event
//         await api.post("/events", form);
//         setMessage("✅ Event created successfully!");
//       }
//       setForm({ title: "", startTime: "", endTime: "", status: "BUSY" });
//     } catch (err) {
//       console.error("Event submission failed:", err);
//       setMessage("❌ Failed to submit event. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
//         <div className="flex justify-between items-center p-5 border-b">
//           <h2 className="text-xl font-bold text-gray-800">{event ? "Edit Event" : "Create New Event"}</h2>
//           <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
//             <X className="w-6 h-6" />
//           </button>
//         </div>
//         <form onSubmit={handleSubmit} className="p-6">
//           {message && (
//             <div className={`mb-4 text-sm p-3 rounded-lg ${message.startsWith("✅") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//               {message}
//             </div>
//           )}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//             <input
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               placeholder="e.g., Team Meeting"
//               value={form.title}
//               onChange={(e) => setForm({ ...form, title: e.target.value })}
//               required
//             />
//           </div>
//           <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//               <input
//                 type="datetime-local"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 value={form.startTime}
//                 onChange={(e) => setForm({ ...form, startTime: e.target.value })}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//               <input
//                 type="datetime-local"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 value={form.endTime}
//                 onChange={(e) => setForm({ ...form, endTime: e.target.value })}
//                 required
//               />
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//             <select
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               value={form.status}
//               onChange={(e) => setForm({ ...form, status: e.target.value })}
//             >
//               <option value="BUSY">Busy</option>
//               <option value="SWAPPABLE">Swappable</option>
//             </select>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 mt-4"
//             disabled={loading}
//           >
//             {loading ? "Submitting..." : event ? "Update Event" : "Create Event"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// components/Events/CreateEventModal.jsx
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { api } from "../api";
import { format, parseISO, isValid } from "date-fns";

export default function CreateEventModal({ isOpen, onclose, onClose, event }) {
  // prefer onClose but accept onclose for compatibility
  const closeHandler = onClose || onclose || (() => {});

  const [form, setForm] = useState({
    title: "",
    startTime: "",
    endTime: "",
    status: "BUSY",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // When the `event` prop changes, populate the form (edit mode).
  useEffect(() => {
    if (event) {
      // event.startTime / endTime may be Date or ISO string
      const parseDateForInput = (d) => {
        if (!d) return "";
        // if it's a Date object
        if (d instanceof Date && isValid(d)) {
          return format(d, "yyyy-MM-dd'T'HH:mm");
        }
        // try parse ISO string
        try {
          const parsed = typeof d === "string" ? parseISO(d) : d;
          if (parsed instanceof Date && isValid(parsed)) {
            return format(parsed, "yyyy-MM-dd'T'HH:mm");
          }
        } catch (err) {
          // fallback below
        }
        return "";
      };

      setForm({
        title: event.title || "",
        startTime: parseDateForInput(event.startTime),
        endTime: parseDateForInput(event.endTime),
        status: event.status || "BUSY",
      });
      setMessage(null);
    } else {
      // Reset form for create mode
      setForm({ title: "", startTime: "", endTime: "", status: "BUSY" });
      setMessage(null);
    }
  }, [event]);

  const onLocalClose = () => {
    // reset internal state
    setMessage(null);
    setForm({ title: "", startTime: "", endTime: "", status: "BUSY" });
    // call parent close handler if provided
    try { closeHandler(); } catch (err) { /* no-op */ }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Set auth header if token exists in localStorage
    const token = localStorage.getItem("token");
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // Validate form minimal: start < end
    if (form.startTime && form.endTime && new Date(form.startTime) >= new Date(form.endTime)) {
        setMessage("❌ End time must be after start time.");
        setLoading(false); // Ensure we set loading to false here
        return;
    }

    try {
        if (event && event.id) {
            // Update existing event
            await api.put(`/events/${Number(event.id)}`, {
                title: form.title,
                startTime: form.startTime,
                endTime: form.endTime,
                status: form.status,
            });
            setMessage("✅ Event updated successfully!");
        } else {
            // Create new event
            await api.post("/events", {
                title: form.title,
                startTime: form.startTime,
                endTime: form.endTime,
                status: form.status,
            });
            setMessage("✅ Event created successfully!");
        }

        // Brief delay to show the success message
        setTimeout(() => {
            setLoading(false);
            onLocalClose();
        }, 600);
    } catch (err) {
        console.error("Event submission failed:", err);
        const serverMsg = err?.response?.data?.error || err?.response?.data?.message;
        setMessage(`❌ Failed to submit event. ${serverMsg ? serverMsg : ""}`.trim());
        setLoading(false); // Ensure loading is reset
    }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {event && event.id ? "Edit Event" : "Create New Event"}
          </h2>
          <button onClick={onLocalClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {message && (
            <div
              className={`mb-4 text-sm p-3 rounded-lg ${
                message.startsWith("✅")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Team Meeting"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="datetime-local"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="datetime-local"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="BUSY">Busy</option>
              <option value="SWAPPABLE">Swappable</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 mt-4"
            disabled={loading}
          >
            {loading ? "Submitting..." : event && event.id ? "Update Event" : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}


