import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './DateControls.css';
import {getDateCount} from "../../utils/dateUtils.js";

const DateControls = ({ startDate, setStartDate, endDate, setEndDate, onNext, onPrev }) => {
    const today = new Date();

    return (
        <div className="date-controls">
            <div className="date-picker">
                <div className="date-input">
                    <label>Start-Date</label>
                    <div className="date-picker-row">
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => {
                                setStartDate(date);
                                if (endDate && date > endDate) {
                                    setEndDate(null);
                                }
                            }}
                            dateFormat="dd.MM.yyyy"
                            className="custom-datepicker"
                            minDate={today}
                            placeholderText="Select start date"
                        />
                    </div>
                </div>

                <div className="date-input">
                    <label>End-Date</label>
                    <div className="date-picker-row">
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="dd.MM.yyyy"
                            className="custom-datepicker"
                            minDate={startDate || today}
                            placeholderText="Select end date"
                            disabled={!startDate}
                        />
                    </div>
                </div>
                <div className={`date-input ${!endDate ? 'invisible' : ''}`}>
                    <div className="date-picker-row"></div>
                    <span className="days-count">{endDate ? getDateCount(startDate, endDate) : 0} days</span>
                </div>
            </div>

            <div className="navigation">
                <button className="nav-btn prev" onClick={onPrev}>‹</button>
                <button className="nav-btn next" onClick={onNext}>›</button>
            </div>
        </div>
    );
};

export default DateControls; 