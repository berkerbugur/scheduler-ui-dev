import {useMemo, useState} from 'react';
import DateControls from '../DateControls/DateControls';
import Calendar from '../Calendar/Calendar';
import Actions from '../Actions/Actions';
import './Schedule.css';
import {getDateRange} from "../../utils/dateUtils.js";

const Schedule = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [slots, setSlots] = useState([]);

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
            />
            <Calendar startDate={startDate} timeSlots={slots} schedule={schedule}/>
            <Actions/>
        </div>
    );
};

export default Schedule;