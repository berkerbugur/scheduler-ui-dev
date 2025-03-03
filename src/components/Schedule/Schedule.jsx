import {useEffect, useMemo, useRef, useState} from 'react';
import DateControls from '../DateControls/DateControls';
import Calendar from '../Calendar/Calendar';
import Actions from '../Actions/Actions';
import './Schedule.css';
import {addDays, getDateCount, getDateRange, getGlobalDateString} from "../../utils/dateUtils.js";
import {api, endpoint} from "../../api/api.js";
import {dismissToast, errorToast, loaderToast} from "../../utils/toasterUtil.js";
import {sortMap} from "../../utils/mapUtil.js";

const Schedule = ({closed, setIsOpen}) => {
    const [schedule, setSchedule] = useState(new Map())
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [pageStart, setPageStart] = useState(true);
    const [pageEnd, setPageEnd] = useState(false);
    const [canReset, setCanReset] = useState(false)
    const [canAutoComp, setCanAutoComp] = useState(false)
    const [canUpload, setCanUpload] = useState(false)
    const [resetSlots, setResetSlots] = useState(false)
    const [endDistance, setEndDistance] = useState(0)
    const [validationError, setValidationError] = useState(false)
    const [template, setTemplate] = useState(new Map())
    const [hover, setHover] = useState(false)

    const calenderRef = useRef(null);

    const prev = () => {
        calenderRef.current?.prevDates()
    };
    const next = () => {
        calenderRef.current?.nextDates()
    };

    useEffect(() => {
        if (closed) {
            setSchedule(new Map())
            setStartDate(null)
            setEndDate(null)
            setCanAutoComp(false)
            setCanUpload(false)
            setCanReset(false)
            setTemplate(new Map())
            setHover(false)
        }
    }, [closed]);

    useEffect(() => {
        let scheduleMap = new Map();
        const dateRange = getDateRange(startDate, endDate);
        dateRange?.forEach(date => {
            schedule.get(getGlobalDateString(date));
            scheduleMap.set(getGlobalDateString(date), schedule.get(getGlobalDateString(date)) || []);
        });
        setCanAutoComp([...scheduleMap.values()].some(slots => slots.length > 0))
        setSchedule(scheduleMap)
        setEndDistance(getDateCount(startDate, endDate))
    }, [endDate, resetSlots]);

    useEffect(() => {
        setEndDate(endDate ? addDays(startDate, endDistance) : startDate);
    }, [startDate]);

    useEffect(() => {
        setCanUpload([...schedule.values()].some(slot => slot.length > 0))
    }, [schedule])

    const dayGap = useMemo(() => {
        let gap = false
        setCanAutoComp(false)

        const rootDays = [...template.keys()]
        rootDays.forEach((day, index) => {
            if (index !== 0 && getDateCount(rootDays[index - 1], day) > 2) {
                gap = true
            }
        })

        if (rootDays.length > 0) {
            setCanAutoComp(!gap)
        }
        return gap
    }, [template]);

    const addSlot = (day, slot) => {
        if (schedule.get(day).includes(slot)) return

        setSchedule(sortMap(schedule.set(day, [...schedule.get(day) || [], slot])));
        setTemplate(sortMap(template.set(day, [...template.get(day) || [], slot])));

        // validates slot ascendancy
        schedule.values().forEach(slots => {
            if (slots.length > 1) {
                setValidationError(slots.some((slot, index) => {
                    if (index !== 0) return slot < slots[index - 1]
                }))
            }
        })



        setCanReset(true)
    };

    const deleteSlot = (day, slot) => {
        setSchedule(new Map(schedule.set(day, [...schedule.get(day) || []].filter(d => d !== slot))));
        setTemplate(new Map(template.set(day, [...schedule.get(day) || []].filter(d => d !== slot))));

        if ([...template.get(day)].length === 0) {
            template.delete(day)
            setTemplate(new Map(template))
        }

        schedule.values().forEach(slots => {
            if (slots.length > 1) {
                setValidationError(slots.some((slot, index) => {
                    if (index !== 0) return slot < slots[index - 1]
                }))
            }
        })

        setCanReset([...schedule.values()].some(slots => slots.length > 0))
    }

    const doReset = () => {
        const clearedSchedule = new Map(schedule)
        clearedSchedule.keys().forEach(day => clearedSchedule.set(day, []))
        setSchedule(clearedSchedule)

        setHover(false)
        setCanReset(false)
        setCanAutoComp(false)
        setCanUpload(false)
        setResetSlots(!resetSlots)
        setTemplate(new Map())
    }

    const doAutoComp = () => {
        loaderToast()
        const requestSchedule = {}

        template.keys().forEach(day => {
            requestSchedule[new Date(day)] = schedule.get(day)
        })

        const request = {
            startDate: String(new Date(startDate)),
            endDate: String(new Date(endDate)),
            schedule: requestSchedule,
        }

        api.put(endpoint.extend, request).then(response => {
            dismissToast()
            const extendedSched = response?.data?.data
            const newSchedule = new Map()

            Object.keys(extendedSched).forEach(day => {
                newSchedule.set(getGlobalDateString(day), [...extendedSched[day]])
            })

            setSchedule(newSchedule)
            setCanAutoComp(false)
            setCanUpload(true)
            setTemplate(new Map())
        }).catch(error => {
            console.log(error)
            dismissToast()
            errorToast()
        })
    }

    const doUpload = () => {
        loaderToast()
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
            dismissToast()
            if (response.data?.validationErrors.length === 0) {
                setIsOpen(true)
            }
        }).catch(error => {
            console.log(error)
            dismissToast()
            errorToast()
        })
    }

    const addTemplate = () => {
        if (!canAutoComp) return

        if (dayGap) return;

        const rootSlots = [...template.values()]
        const templateLength = rootSlots.length
        const cpSched = new Map(schedule)

        cpSched?.keys().forEach((day, index) => {
            if (![...template.keys()].includes(day)) {
                cpSched.set(day, index + 1 % templateLength === 0 ? [...rootSlots[templateLength - 1]] : [...rootSlots[index % templateLength]]);
            }
        })
        setSchedule(cpSched)
        setHover(true)
    }

    const removeTemplate = () => {
        if (!canAutoComp) return

        if (dayGap) return;

        const roots = [...template.keys()]
        const cpSched = new Map(schedule)

        cpSched?.keys().forEach(key => {
            if (!roots.includes(key)) {
                cpSched.set(key, [])
            }
        })

        setSchedule(cpSched)
        setHover(false)
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
                canAutoComp={canAutoComp}
                template={template}
                dayGap={dayGap}
                hover={hover}
            />
            <Actions
                reset={doReset}
                autoComp={doAutoComp}
                upload={doUpload}
                canReset={canReset}
                canAutoComp={canAutoComp}
                canUpload={canUpload}
                addTemplate={addTemplate}
                removeTemplate={removeTemplate}
                validationErr={validationError}
            />
        </div>
    );
};

export default Schedule;