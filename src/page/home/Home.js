import DatePicker from "../../component/date-picker/DatePicker";

function Home () {
    return (
        <div className="home-container">
            <h1 className='text-black font-bold'>Create new Schedule</h1>
            <DatePicker />
        </div>
    )
}

export default Home;