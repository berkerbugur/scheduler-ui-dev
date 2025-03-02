import {useEffect, useRef, useState} from 'react';
import './TimeSlots.css';

const TimeSlots = ({ timeSlots, day, addSlot, scrollable, setScrollable}) => {
    const [hover, setHover] = useState(false)
    const [input, setInput] = useState('');
    const [isAdd, setIsAdd] = useState(true)
    const slotsRef = useRef(null);

    useEffect(() => {
        setScrollable(hover && (timeSlots || []).length > 4)
    }, [hover]);

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

    const handleScroll = (e) => {
        if (scrollable && slotsRef.current?.contains(e.target)) {
            const scrollDelta = e.deltaY;
            slotsRef.current.scrollTop += scrollDelta;
        }
    }

    return (
        <div ref={slotsRef} className={`time-slots ${hover ? 'active' : ''}`} onWheel={(e) => {handleScroll(e)}} onMouseEnter={() => setHover(true)}
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
                        onMouseLeave={handleUnfocus}
                        onKeyDown={(e) => {e.keyCode === 13 ? handleAdd() : e.keyCode === 27 ? handleUnfocus() : null }}
                    />
            }
        </div>
    );
};

export default TimeSlots;