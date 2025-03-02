import {useEffect, useRef, useState} from 'react';
import DateControls from '../DateControls/DateControls';
import Calendar from '../Calendar/Calendar';
import Actions from '../Actions/Actions';
import './Schedule.css';
import {getDateRange} from "../../utils/dateUtils.js";

const Schedule = () => {
    const [startDate, setStartDate] = useState(null);
    const [schedule, setSchedule] = useState(null)
    const [endDate, setEndDate] = useState(null);
    const [pageStart, setPageStart] = useState(true);
    const [pageEnd, setPageEnd] = useState(false);
    const [canReset, setCanReset] = useState(false)
    const [canAutoComp, setCanAutoComp] = useState(false)
    const [canUpload, setCanUpload] = useState(false)
    const [resetSlots, setResetSlots] = useState(false)
    const calenderRef = useRef(null);

    const prev = () => {calenderRef.current?.prevDates()};
    const next = () => {calenderRef.current?.nextDates()};

    useEffect(() => {
        let scheduleMap = new Map();
        const dateRange = getDateRange(startDate, endDate);
        dateRange?.forEach(date => { scheduleMap.set(date, []); });
        setSchedule(scheduleMap)
    }, [startDate, endDate, resetSlots]);

    const addSlot = (day, slot) => {
        setCanReset(true)
        setSchedule(new Map(schedule.set(day, [...schedule.get(day) || [], slot]))); // TODO problematic entry addition, key repetition
    };

    const doReset = () => {
        setCanReset(false)
        setCanAutoComp(false)
        setCanUpload(false)
        setResetSlots(!resetSlots)
    }

    const doAutoComp = () => {
        setCanAutoComp(false)
    }

    const doUpload = () => {
        setCanReset(false)
        setCanAutoComp(false)
        setCanUpload(false)
    }

    const onHover = () => {
        console.log('reflect sched')
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
            <Calendar
                schedule={schedule}
                setPageStart={setPageStart}
                setPageEnd={setPageEnd}
                addSlot={addSlot}
                ref={calenderRef}
            />
            <Actions
                reset={doReset}
                autoComp={doAutoComp}
                upload={doUpload}
                canReset={canReset}
                canAutoComp={canAutoComp}
                canUpload={canUpload}
                hover={onHover}
            />
        </div>
    );
};

export default Schedule;