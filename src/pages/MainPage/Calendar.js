
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";
import "../../styles/Calendar.css";

const toDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
};

export default function CustomCalendar({
    initialDate = new Date(),
    viewDate,
    onViewDateChange,
    onDateChange,
    calendarByDate = {},
}) {
    const [selectedDate, setSelectedDate] = useState(initialDate);

    const handledDateChange = (value) => {
        const next = value instanceof Date ? value : value?.[0];

        if (!next) return;

        setSelectedDate(next);
        onDateChange?.(next);
    };

    const getDayMeta = (date) => {
        const key = toDateKey(date);
        const day = calendarByDate[key];

        if (!day || !day.hasTodo) {
            return {
                hasTodos: false,
                remaining: null,
                allDone: false,
            };
        }

        return {
            hasTodos: true,
            remaining: day.remaining,
            allDone: day.remaining === 0,
        };
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={handledDateChange}
                value={selectedDate}
                activeStartDate={viewDate}
                onActiveStartDateChange={({ activeStartDate }) => {
                    if (activeStartDate) {
                        onViewDateChange?.(activeStartDate);
                    }
                }}
                calendarType="gregory"
                view="month"
                prev2Label={null}
                next2Label={null}
                showNeighboringMonth={true}
                formatDay={(locale, date) => String(date.getDate())}
                tileContent={({ date, view }) => {
                    if (view !== "month") return null;

                    const { hasTodos, remaining, allDone } = getDayMeta(date);

                    if (!hasTodos) return null;

                    return (
                        <div className="tile-meta">
                            {allDone ? "★" : remaining}
                        </div>
                    );
                }}
                tileClassName={({ date, view }) => {
                    if (view !== "month") return "";

                    const { hasTodos, allDone } = getDayMeta(date);

                    if (!hasTodos) return "";

                    return allDone ? "tile-done" : "tile-has";
                }}
            />
        </div>
    );
}
