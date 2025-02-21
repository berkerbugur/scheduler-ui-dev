import {useState} from "react";

function DatePicker() {
    const [date, setDate] = useState(null);

    return (
        <div className='date-picker'>
            <div>
                <h3> Start-Date </h3>
            </div>
        </div>
    )
}

export default DatePicker;