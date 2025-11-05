// components/Events/EventList.jsx
import React from "react";
import EventCard from "./EventCard";

export default function EventList({ events, onToggle, onDelete }) {
  if (!events.length) return null;

  return (
    <div className="flex flex-col space-y-3">
      {events.map((ev) => (
        <EventCard key={ev.id} event={ev} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}
