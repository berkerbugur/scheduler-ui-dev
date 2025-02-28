import {useState} from 'react';
import './TimeSlots.css';

const TimeSlots = ({ day, timeSlots, addSlot }) => {
    const [hover, setHover] = useState(false)
    timeSlots && timeSlots[0] && setHover(true)

    const handleInput = () => {
        addSlot(day, '09:00')
        console.log('input')
    };

    return (
        <div className={`time-slots ${hover ? 'active' : ''}`} onMouseEnter={() => setHover(true)}
             onMouseLeave={() => setHover(false)}>
            {timeSlots.length > 0 && (
                <div
                    className="time-slot selected">
                    Time
                </div>
            )}
            <div
                className={`add-time ${hover ? '' : 'invisible'}`} onClick={handleInput}>
                Add Time
            </div>
        </div>
    );
};

export default TimeSlots;