import {useMemo, useRef, useState} from 'react';
import DateControls from '../DateControls/DateControls';
import Calendar from '../Calendar/Calendar';
import Actions from '../Actions/Actions';
import './Schedule.css';
import {getDateRange} from "../../utils/dateUtils.js";

const Schedule = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const calenderRef = useRef(null);

    const prev = () => {calenderRef.current?.prevDates()};
    const next = () => {calenderRef.current?.nextDates()};

    const schedule = useMemo(() => {
        let scheduleMap = new Map();
        const dateRange = getDateRange(startDate, endDate);
        dateRange?.forEach(date => { scheduleMap.set(date, []); });
        return scheduleMap
    }, [endDate]);

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
            />
            <Calendar schedule={schedule} ref={calenderRef} />
            <Actions/>
        </div>
    );
};

export default Schedule;