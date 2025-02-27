import TimeSlots from '../TimeSlots/TimeSlots.jsx';
import './Calendar.css';
import {useState} from "react";
import {getDayName, getFormattedDate} from "../../utils/dateUtils.js";

const Calendar = ({startDate, timeSlots, schedule}) => {
    const days = [...(schedule || []).keys()]
    const [slots, setSlots] = useState()

    return (
        <div className={`calendar ${!days ? 'calendar-empty' : ''}`}>
            {!!days && days.map((day, index) => (
                <div key={index} className="day-column">
                    <div className={`day-header ${!day ? 'invisible' : ''}`}>
                        <div className="day-name">{getDayName(day)}</div>
                        <div className="day-date">{getFormattedDate(day)}</div>
                    </div>
                    <TimeSlots
                        timeSlots={timeSlots}
                        isVisible={!!startDate}
                        isFirstColumn={index === 0}
                    />
                </div>
            ))}
        </div>
    );
};

export default Calendar; 