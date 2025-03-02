import {useEffect, useState} from 'react';
import './TimeSlots.css';

const TimeSlots = ({ timeSlots, day, addSlot }) => {
    const [hover, setHover] = useState(false)
    const [input, setInput] = useState('');
    const [isAdd, setIsAdd] = useState(true)

    const handleAdd = () => {
        if (input) addSlot(day, input)
        setIsAdd(false)
        setInput('')
    };

    const handleUnfocus = () => {
        if (input) addSlot(day, input)
        setIsAdd(true);
        setInput('')
    }

    const handleInput = (event) => {
        setInput(event?.target.value)
    }

    return (
        <div className={`time-slots ${hover ? 'active' : ''}`} onMouseEnter={() => setHover(true)}
             onMouseLeave={() => setHover(false)}>
            {timeSlots && timeSlots?.length > 0 && timeSlots?.map((slot, index) => (
                <div
                    key={index}
                    className="time-slot selected">
                    {slot}
                </div>
            ))
            }
            {
                isAdd ?
                    <div
                        className={`add-time ${hover ? '' : 'invisible'}`} onClick={handleAdd}>
                        Add Time
                    </div>
                    :
                    <input
                        className='time-input'
                        type="time"
                        value={input}
                        onChange={handleInput}
                        onBlur={handleUnfocus}
                        onKeyDown={(e) => {e.keyCode === 13 ? handleAdd() : null }}
                    />
            }
        </div>
    );
};

export default TimeSlots;