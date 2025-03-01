import TimeSlots from '../TimeSlots/TimeSlots.jsx';
import './Calendar.css';
import {getDayName, getFormattedDate} from "../../utils/dateUtils.js";
import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react";
import ScrollBar from "../ScrollBar/ScrollBar.jsx";

const maxDayIndex = 7;
const pageDirection = {
    prev: 'prev',
    next: 'next',
}

// eslint-disable-next-line react/display-name
const Calendar = forwardRef(({schedule, setPageStart, setPageEnd, addSlot}, ref) => {
    const [minPage, setMinPage] = useState(0)
    const [maxPage, setMaxPage] = useState(0)

    const days = useMemo(() => {
        return [...(schedule || []).keys()];
    }, [schedule]);

    useEffect(() => {
        setMinPage(0);
        setMaxPage(days.length > maxDayIndex ? maxDayIndex : days.length);
    }, [days]);

    let pagedDays = useMemo(() => {
        setPageStart(minPage === 0);
        setPageEnd(maxPage === days?.length || 0); // TODO bad state call? Transform into useEffect?
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

    const pageCount = useMemo(() => {
        const scheduleCount = [...((schedule || []).keys())].length
        return Math.ceil(scheduleCount / maxDayIndex);
    }, [schedule]);

    const currentPage = useMemo(() => {
        return Math.ceil(minPage / maxDayIndex)
    }, [minPage]);

    const handleScroll = (e) => {
        if (e.deltaY < 0) {
            prevDates();
        } else {
            nextDates();
        }
    };

    return (
        <div>
            <div className={`calendar ${!days ? 'calendar-empty' : ''}`} onWheel={handleScroll}>
                {days && pagedDays.map((day, index) => (
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
            <ScrollBar pageCount={pageCount} currentPage={currentPage} />
        </div>
    );
});

export default Calendar;