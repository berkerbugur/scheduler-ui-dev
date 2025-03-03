import {useEffect, useMemo, useRef, useState} from 'react';
import DateControls from '../DateControls/DateControls';
import Calendar from '../Calendar/Calendar';
import Actions from '../Actions/Actions';
import './Schedule.css';
import {addDays, getDateCount, getDateRange, getGlobalDateString} from "../../utils/dateUtils.js";
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
    const [canReflect, setCanReflect] = useState(false)
    const [endDistance, setEndDistance] = useState(0)
    const [validationError, setValidationError] = useState(false)
    const [template, setTemplate] = useState({
        repetition: 0,
        rootDays: [],
        rootSlots: []
    })

    const calenderRef = useRef(null);

    const prev = () => {
        calenderRef.current?.prevDates()
    };
    const next = () => {
        calenderRef.current?.nextDates()
    };

    const rep = useMemo(() => {
        const tempDays = template.rootDays
        return [...schedule.keys()].length > maxDayIndex ?
            tempDays.length > 0
                ? Math.ceil(maxDayIndex / tempDays.length)
                : 0
            : Math.ceil([...schedule.keys()].length / tempDays.length);
    }, []);

    useEffect(() => {
        let scheduleMap = new Map();
        const dateRange = getDateRange(startDate, endDate);
        dateRange?.forEach(date => {
            schedule.get(getGlobalDateString(date));
            scheduleMap.set(getGlobalDateString(date), schedule.get(getGlobalDateString(date)) || []);
        });

        setCanAutoComp(scheduleMap.values().some(slots => slots.length > 0))
        setSchedule(scheduleMap)
        setEndDistance(getDateCount(startDate, endDate))
    }, [endDate, resetSlots]);

    useEffect(() => {
        setEndDate(endDate ? addDays(startDate, endDistance) : startDate);
    }, [startDate]);

    useEffect(() => {
        let dayGap = false
        const roots = template.rootDays
        roots.forEach((day, index) => {
            if (index !== 0 && roots[index - 1] && getDateCount(roots[index - 1], day) > 2) {
                dayGap = true
            }
        })

        setCanReflect(!dayGap)

        if (dayGap) {
            return
        }

        hover ? addTemplate() : removeTemplate();
    }, [hover])

    useEffect(() => {
        //const daysLength = template.rootDays.length

        // console.log([...schedule.keys()].length > maxDayIndex ? daysLength > 0 ? Math.ceil(maxDayIndex / daysLength) : 0 : Math.ceil([...schedule.keys()].length / daysLength))

        // setTemplate({
        //     repetition: [...schedule.keys()].length > maxDayIndex ? daysLength > 0 ? Math.ceil(maxDayIndex / daysLength) : 0 : Math.ceil([...schedule.keys()].length / daysLength) || 0,
        //     rootDays: template.rootDays,
        //     rootSlots: template.rootSlots,
        // })

        setCanUpload([...schedule.values()].some(slot => slot.length > 0))
    }, [schedule]) // TODO infinity bug

    const addSlot = (day, slot) => {
        if (schedule.get(day).includes(slot)) return

        setSchedule(new Map(schedule.set(day, [...schedule.get(day) || [], slot])));

        const tempDays = template.rootDays
        const tempSlots = []

        if (!tempDays.includes(day)) {
            tempDays.push(day)
            tempDays.sort()
        }

        schedule.values().forEach(slots => {
            if (slots.length > 0) {
                if (slots.length >= 1) {
                    setValidationError(slots.some((slot, index) => {
                        if (index !== 0) return slot < slots[index - 1]
                    }))
                }

                tempSlots.push(slots)
            }
        })

        setTemplate({
            repetition: rep,
            rootDays: tempDays,
            rootSlots: tempSlots,
        })

        setCanReset(true)
        setCanAutoComp(true)
    };

    const deleteSlot = (day, slot) => {
        const slots = schedule.get(day).filter(s => s !== slot);
        setSchedule(new Map(schedule.set(day, slots)))

        schedule.values().forEach(slots => {
            if (slots.length >= 1) {
                setValidationError(slots.some((slot, index) => {
                    if (index !== 0) return slot < slots[index - 1]
                }))
            }
        })

        setTemplate({
            repetition: rep,
            rootSlots: template.rootSlots.filter(s => s !== slot),
            rootDays: template.rootDays.filter(d => d !== day)
        })
    }

    const doReset = () => {
        const clearedSchedule = new Map(schedule)
        clearedSchedule.keys().forEach(day => clearedSchedule.set(day, []))
        setSchedule(clearedSchedule)

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
        const requestSchedule = {}

        schedule.keys().forEach(day => {
            if (template.rootDays.includes(day)) requestSchedule[new Date(day)] = schedule.get(day)
        })

        const request = {
            startDate: String(new Date(startDate)),
            endDate: String(new Date(endDate)),
            schedule: requestSchedule,
        }

        api.put(endpoint.extend, request).then(response => {
            const extendedSched = response?.data?.data
            const newSchedule = new Map()

            Object.keys(extendedSched).forEach(day => {
                newSchedule.set(getGlobalDateString(day), [...extendedSched[day]])
            })

            setSchedule(newSchedule)
            setCanAutoComp(false)
            setHover(false)
            setCanUpload(true)
            setTemplate({
                repetition: 0,
                rootDays: [],
                rootSlots: []
            })
        }).catch(error => {
            console.log(error)
        })
    }

    const doUpload = () => {
        const requestSchedule = {}

        schedule.keys().forEach(day => {
            requestSchedule[new Date(day)] = schedule.get(day)
        })

        const request = {
            startDate: String(new Date(startDate)),
            endDate: String(new Date(endDate)),
            schedule: requestSchedule,
        }

        api.post(endpoint.create, request).then(response => {

            if (response.data?.validationErrors.length === 0) {
                setHover(false)
                setCanAutoComp(false)
                setCanUpload(false)
                setCanReset(false)
                setTemplate({
                    repetition: 0,
                    rootDays: [],
                    rootSlots: []
                })
            }
        }).catch(error => {
            console.log(error)
        })
    }

    const onHover = (val) => {
        setHover(canAutoComp && val)
    }

    const addTemplate = () => {
        const rootSlots = template.rootSlots
        const templateLength = rootSlots.length
        const cpSched = new Map(schedule)

        cpSched?.keys().forEach((day, index) => {
            if (!template.rootDays.includes(day)) {
                cpSched.set(day, index + 1 % templateLength === 0 ? [...rootSlots[templateLength - 1]] : [...rootSlots[index % templateLength]]);
            }
        })
        setSchedule(cpSched)
    }

    const removeTemplate = () => {
        if (!canAutoComp) return

        const roots = template.rootDays
        const cpSched = new Map(schedule)

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
                setPageStart={setPageStart}
                setPageEnd={setPageEnd}
                addSlot={addSlot}
                deleteSlot={deleteSlot}
                ref={calenderRef}
                canAutoComp={hover}
                template={template}
                canReflect={canReflect}
            />
            <Actions
                reset={doReset}
                autoComp={doAutoComp}
                upload={doUpload}
                canReset={canReset}
                canAutoComp={canAutoComp}
                canUpload={canUpload}
                hover={onHover}
                validationErr={validationError}
            />
        </div>
    );
};

export default Schedule;