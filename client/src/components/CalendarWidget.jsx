import { ChevronLeft, ChevronRight } from "lucide-react";
import { eachDayOfInterval, endOfMonth, format, isSameDay, isToday, startOfMonth } from "date-fns";

export default function CalendarWidget({ currentMonth, selectedDate, onDateSelect, onMonthChange, events }) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  const startingDayOfWeek = monthStart.getDay();
  const leadingEmptyDays = Array(startingDayOfWeek).fill(null);
  const allDays = [...leadingEmptyDays, ...daysInMonth];

  const hasEventOnDay = (date) => events.some((event) => isSameDay(new Date(event.startTime), date));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-xs w-full">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => onMonthChange(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-bold text-lg text-gray-800">{format(currentMonth, "MMMM yyyy")}</h3>
        <button onClick={() => onMonthChange(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-sm gap-y-2">
        {dayNames.map((day, idx) => (
          <div key={`${day}-${idx}`} className="font-semibold text-gray-500">
            {day}
          </div>
        ))}

        {allDays.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="h-10" />;
          const isSelected = isSameDay(day, selectedDate);
          const today = isToday(day);
          const isEventDay = hasEventOnDay(day);

          return (
            <div key={`day-${day.toISOString()}`} className="flex items-center justify-center h-10">
              <button
                onClick={() => onDateSelect(day)}
                className={`w-10 h-10 flex items-center justify-center text-gray-800 rounded-full transition relative
                ${isSelected ? "bg-blue-600 text-white font-bold shadow-lg" : today ? "border border-gray-300" : "hover:bg-gray-100"}`}
              >
                {format(day, "d")}
                {isEventDay && !isSelected && <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
