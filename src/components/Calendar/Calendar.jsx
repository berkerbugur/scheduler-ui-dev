import TimeSlots from '../TimeSlots/TimeSlots.jsx';
import './Calendar.css';
import {getDayName, getFormattedDate} from "../../utils/dateUtils.js";
import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react";

const maxDayIndex = 7;
const pageDirection = {
    prev: 'prev',
    next: 'next',
}

// eslint-disable-next-line react/display-name
const Calendar = forwardRef(({schedule, setPageStart, setPageEnd, addSlot}, ref) => {
    const days = [...(schedule || []).keys()];
    const [minPage, setMinPage] = useState(0)
    const [maxPage, setMaxPage] = useState(0)

    useEffect(() => {
        setMinPage(0);
        setMaxPage(days.length > maxDayIndex ? maxDayIndex : days.length);
    }, [days.length]);

    let pagedDays = useMemo(() => {
        setPageStart(minPage === 0);
        setPageEnd(maxPage === days.length || 0); // TODO bad state call? Transform into useEffect
        return days.slice(minPage, maxPage)
    }, [minPage, maxPage]);

    useImperativeHandle(ref, () => ({
        nextDates,
        prevDates
    }));

    const increasePage = (increment) => {
        setMaxPage((prevMax) => prevMax + increment);
        setMinPage((prevMin) => prevMin + increment);
    }

    const decreasePage = (decrement) => {
        setMinPage((prevMin) => prevMin - decrement);
        setMaxPage((prevMax) => prevMax - decrement);
    }

    const paginateDays = (direction) => {
        if (direction === pageDirection.next) {
            maxPage + maxDayIndex > days.length ? increasePage(days.length - maxPage) : increasePage(maxDayIndex)
        }

        if (direction === pageDirection.prev) {
            minPage - maxDayIndex < 0 ? decreasePage(minPage) : decreasePage(maxDayIndex)
        }
    }

    const nextDates = () => {
        paginateDays(pageDirection.next)
    };

    const prevDates = () => {
        paginateDays(pageDirection.prev)
    };

    return (
        <div className={`calendar ${!days ? 'calendar-empty' : ''}`}>
            {!!days && pagedDays.map((day, index) => (
                <div key={index} className="day-column">
                    <div className={`day-header ${!day ? 'invisible' : ''}`}>
                        <div className="day-name">{getDayName(day)}</div>
                        <div className="day-date">{getFormattedDate(day)}</div>
                    </div>
                    <TimeSlots
                        day={day}
                        timeSlots={schedule.get(day)}
                        addSlot={addSlot}
                    />
                </div>
            ))}
        </div>
    );
});

export default Calendar;