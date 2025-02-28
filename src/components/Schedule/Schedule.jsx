import {useEffect, useMemo, useRef, useState} from 'react';
import DateControls from '../DateControls/DateControls';
import Calendar from '../Calendar/Calendar';
import Actions from '../Actions/Actions';
import './Schedule.css';
import {getDateRange} from "../../utils/dateUtils.js";

const Schedule = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [pageStart, setPageStart] = useState(true);
    const [pageEnd, setPageEnd] = useState(false);
    const calenderRef = useRef(null);

    const prev = () => {calenderRef.current?.prevDates()};
    const next = () => {calenderRef.current?.nextDates()};

    const schedule = useMemo(() => {
        let scheduleMap = new Map();
        const dateRange = getDateRange(startDate, endDate);
        dateRange?.forEach(date => { scheduleMap.set(date, []); });
        return scheduleMap
    }, [endDate]);

    useEffect(() => {
        console.log(schedule)
    }, [schedule]);

    const addSlot = (day, slot) => {
        // TODO does not update with child trigger
        schedule.set(day, [...schedule.get(day), slot]);
    }

    return (
        <div className="schedule-container">
            <h1>Create new Schedule</h1>
            <DateControls
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                onPrev={prev}
                onNext={next}
                pageStart={pageStart}
                pageEnd={pageEnd}
            />
            <Calendar schedule={schedule} setPageStart={setPageStart} setPageEnd={setPageEnd} addSlot={addSlot} ref={calenderRef} />
            <Actions/>
        </div>
    );
};

export default Schedule;