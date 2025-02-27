import { useState } from 'react';
import './TimeSlots.css';

const TimeSlots = ({ timeSlots }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleSlotClick = (timeIndex) => {
        setSelectedSlot(timeIndex);
    };

    return (
        <div className="time-slots">
            {!!timeSlots && timeSlots.map((time, timeIndex) => (
                <div
                    key={timeIndex}
                    className={`time-slot ${selectedSlot === timeIndex ? 'selected' : ''}`}
                    onClick={() => handleSlotClick(timeIndex)}
                >
                    {time}
                </div>
            ))}
        </div>
    );
};

export default TimeSlots; 