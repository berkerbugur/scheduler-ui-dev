import {useEffect, useRef, useState} from 'react';
import DateControls from '../DateControls/DateControls';
import Calendar from '../Calendar/Calendar';
import Actions from '../Actions/Actions';
import './Schedule.css';
import {getDateCount, getDateRange, getGlobalDateString} from "../../utils/dateUtils.js";
import {maxDayIndex} from "../../constant/appConstants.js";
import {api, endpoint} from "../../api/api.js";

const Schedule = () => {
    const [startDate, setStartDate] = useState(null);
    const [schedule, setSchedule] = useState(new Map())
    const [endDate, setEndDate] = useState(null);
    const [pageStart, setPageStart] = useState(true);
    const [pageEnd, setPageEnd] = useState(false);
    const [canReset, setCanReset] = useState(false)
    const [canAutoComp, setCanAutoComp] = useState(false)
    const [canUpload, setCanUpload] = useState(false)
    const [resetSlots, setResetSlots] = useState(false)
    const [hover, setHover] = useState(false)
    const [template, setTemplate] = useState({
        repetition: 0,
        rootDays: [],
        rootSlots: []
    })
    const calenderRef = useRef(null);

    const prev = () => {calenderRef.current?.prevDates()};
    const next = () => {calenderRef.current?.nextDates()};

    useEffect(() => {
        let scheduleMap = new Map();
        const dateRange = getDateRange(startDate, endDate);
        dateRange?.forEach(date => { scheduleMap.set(getGlobalDateString(date), []); });
        setSchedule(scheduleMap)
    }, [startDate, endDate, resetSlots]);

    useEffect(() => {
        hover ? addTemplate() : removeTemplate();
    }, [hover])

    const addSlot = (day, slot) => {
        setSchedule(new Map(schedule.set(day, [...schedule.get(day) || [], slot])));

        const tempDays = template.rootDays
        const tempSlots = template.rootSlots

        tempDays.push(day)
        tempSlots.push(slot)

        setTemplate({
            repetition: tempDays.length > 0 ? Math.ceil(maxDayIndex / tempDays.length) : 0,
            rootDays: tempDays,
            rootSlots: tempSlots,
        })

        setCanReset(true)
        setCanAutoComp(true)
    };

    const doReset = () => {
        setCanReset(false)
        setCanAutoComp(false)
        setCanUpload(false)
        setResetSlots(!resetSlots)
        setTemplate({
            repetition: 0,
            rootDays: [],
            rootSlots: []
        })
    }

    const doAutoComp = () => {
        const requestSchedule = new Map()

        schedule.keys().forEach(day => {
            if (template.rootDays.includes(day)) requestSchedule.set(new Date(day), [...schedule.get(day)])
        })

        const request = {
            startDate: startDate,
            endDate: endDate,
            schedule: requestSchedule,
        }

        api.put(endpoint.extend, request).then(response => {
            console.log('Girdim')
            console.log(response)

            setCanAutoComp(false)
            setHover(false)
            setCanUpload(true)
            setTemplate({
                repetition: 0,
                rootDays: [],
                rootSlots: []
            })
        }).catch(error => {
            console.log('burdayim')
            console.log(error)
        })
    }

    const doUpload = () => {
        setCanReset(false)
        setCanAutoComp(false)
        setCanUpload(false)
        setTemplate({
            repetition: 0,
            rootDays: [],
            rootSlots: []
        })
    }

    const onHover = (val) => {
        setHover(canAutoComp && val)
    }

    const includesGap = () => {
        let dayGap = false
        const roots = template.rootDays
        roots.forEach((day, index) => {
            if (roots[index-1] && getDateCount(roots[index-1], day) > 2) {
                dayGap = true
            }
        })

        return dayGap
    }

    const addTemplate = () => {
        const templateLength = template.rootSlots.length
        const cpSched = new Map(schedule) // to not trigger multiple re-renders

        if (includesGap()) {
            return
        }

        cpSched?.keys().forEach((day, index) => {
            if (!template.rootDays.includes(day)) {
                cpSched.set(day, index+1 % templateLength === 0 ? [template.rootSlots[templateLength-1]] : [template.rootSlots[index % templateLength]]);
            }
        })

        setSchedule(cpSched)
    }

    const removeTemplate = () => {
        const roots = template.rootDays
        const cpSched = new Map(schedule) // to not trigger multiple re-renders

        cpSched?.keys().forEach(key => {
            if (!roots.includes(key)) {
                cpSched.set(key, [])
            }
        })

        setSchedule(cpSched)
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
                days={[...(schedule || []).keys()]}
                setPageStart={setPageStart}
                setPageEnd={setPageEnd}
                addSlot={addSlot}
                ref={calenderRef}
                canAutoComp={hover}
                template={template}
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