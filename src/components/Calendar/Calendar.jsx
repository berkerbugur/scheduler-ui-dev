import TimeSlots from '../TimeSlots/TimeSlots.jsx';
import './Calendar.css';
import {getDayName, getFormattedDate} from "../../utils/dateUtils.js";
import {forwardRef, useCallback, useImperativeHandle, useMemo, useState} from "react";

const maxDayIndex = 7;
const pageDirection = {
    prev: 'prev',
    next: 'next',
}

// eslint-disable-next-line react/display-name
const Calendar = forwardRef(({schedule}, ref) => {
    const days = [...(schedule || []).keys()];
    let minPage = 0;
    let maxPage = days.length > maxDayIndex ? maxDayIndex : days.length;

    let pagedDays = useMemo(() => {
        // TODO Not Rerendering
        return days.slice(minPage, maxPage)
    }, [minPage, maxPage]);

    useImperativeHandle(ref, () => ({
        nextDates,
        prevDates
    }));

    const increasePage = (increment) => {
        maxPage += increment;
        minPage += increment;
    }

    const decreasePage = (decrement) => {
        minPage -= decrement;
        maxPage -= decrement;
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
                        timeSlots={schedule.get(day)}
                    />
                </div>
            ))}
        </div>
    );
});

export default Calendar;