import TimeSlots from '../TimeSlots/TimeSlots.jsx';
import './Calendar.css';
import {getDayName, getFormattedDate} from "../../utils/dateUtils.js";
import {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react";
import ScrollBar from "../ScrollBar/ScrollBar.jsx";
import {maxDayIndex} from "../../constant/appConstants.js"

const pageDirection = {
    prev: 'prev',
    next: 'next',
}

// eslint-disable-next-line react/display-name
const Calendar = forwardRef(({
                                 schedule,
                                 template,
                                 setPageStart,
                                 setPageEnd,
                                 addSlot,
                                 deleteSlot,
                                 canAutoComp,
                                 dayGap,
                                 hover
                             }, ref) => {
    const [minPage, setMinPage] = useState(0)
    const [maxPage, setMaxPage] = useState(0)
    const [pagedDays, setPagedDays] = useState([])
    const [days, setDays] = useState([])
    const [scrollable, setScrollable] = useState(true)

    useEffect(() => {
        const dayList = [...(schedule || []).keys()]
        setMinPage(0);
        setMaxPage(dayList.length > maxDayIndex ? maxDayIndex : dayList.length);
        setDays(dayList)
    }, [schedule]);

    useEffect(() => {
        setPageStart(minPage === 0);
        setPageEnd(maxPage === days?.length);
        setPagedDays(days.slice(minPage, maxPage))
    }, [days, minPage, maxPage]);

    const canReflect = useMemo(() => {
        return [...template.keys()].length > 0 && !dayGap
    }, [dayGap, template]);

    const rep = useMemo(() => {
        const tempDays = [...template.keys()]
        let repeat = 0

        if (!dayGap && tempDays.length > 0) {
            if ([...schedule.keys()].length < maxDayIndex) {
                repeat = Math.ceil([...schedule.keys()].length / tempDays.length)
            } else {
                repeat = Math.ceil(maxDayIndex / tempDays.length)
            }
        }

        return repeat
    }, [dayGap, schedule, template]);

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
        if (!scrollable) {
            if (direction === pageDirection.next) {
                maxPage + maxDayIndex > days.length ? increasePage(days.length - maxPage) : increasePage(maxDayIndex)
            }

            if (direction === pageDirection.prev) {
                minPage - maxDayIndex < 0 ? decreasePage(minPage) : decreasePage(maxDayIndex)
            }
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

    const getWidth = useCallback((index) => {
        const rootLength = [...template.values()].length
        const dayList = [...schedule.keys()]
        const dayListLength = dayList.length

        const seed = dayListLength > maxDayIndex ? maxDayIndex : dayListLength

        if (rep - 1 === index) {
            const mod = seed % rootLength === 0 ? 1 : seed % rootLength;
            return (160 * mod) + (12 * (mod - 1))
        }

        return (160 * rootLength) + (12 * (rootLength - 1))
    }, [template, schedule]);

    return (
        <div>
            <div className={`calendar ${!days ? 'calendar-empty' : ''}`} onWheel={handleScroll}>
                {pagedDays && pagedDays.map((day, index) => (
                    <div key={index} className="day-column">
                        <div className={`day-header ${day ? '' : 'invisible'}`}>
                            <div className="day-name">{getDayName(day)}</div>
                            <div className="day-date">{getFormattedDate(day)}</div>
                        </div>
                        <TimeSlots
                            day={day}
                            timeSlots={schedule.get(day)}
                            addSlot={addSlot}
                            scrollable={scrollable}
                            setScrollable={setScrollable}
                            deleteSlot={deleteSlot}
                        />
                    </div>
                ))}
            </div>
            <div className={`template-container ${hover && minPage === 0 && canAutoComp && canReflect ? "" : "invisible"}`}>
                {
                    rep > 0 && [...Array(rep)].map((_, index) => (
                        <div key={index} className="template"
                             style={{width: getWidth(index) + 'px'}}>{index > 0 ? 'Copy' : 'Template'}</div>
                    ))
                }
            </div>
            <ScrollBar pageCount={pageCount} currentPage={currentPage}/>
        </div>
    );
});

export default Calendar;