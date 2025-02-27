import { useState } from 'react';
import './TimeSlots.css';

const TimeSlots = ({ timeSlots, isVisible, isFirstColumn }) => {
    const [selectedSlot, setSelectedSlot] = useState(null);

    const handleSlotClick = (timeIndex) => {
        setSelectedSlot(timeIndex);
    };

    if (!isFirstColumn) return null;

    return (
        <div className={`time-slots ${!isVisible ? 'invisible' : ''}`}>
            {timeSlots.map((time, timeIndex) => (
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