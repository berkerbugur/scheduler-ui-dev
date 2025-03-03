const getDayName = (date) => {
    return date ? new Date(date).toLocaleDateString("en-US", { weekday: 'long' }) : null;
}

const getGlobalDateString = (date) => {
    // need to use js global date as the initial dateStr
    return new Date(date).toLocaleDateString("en-US", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

const getFormattedDate = (date) => {
    return date ? new Date(date).toLocaleDateString("de-DE", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }) : null;
}

const getDateRange = (startDate, endDate) => {
    if (!startDate || !endDate)
        return null

    const fDate = new Date(startDate)
    const eDate = new Date(endDate)

    let dates = []
    while (fDate < eDate) {
        dates = [...dates, new Date(fDate)]
        fDate.setDate(fDate.getDate() + 1)
    }
    dates = [...dates, endDate]
    return dates
}

const getDateCount = (startDate, endDate) => {
    const fDate = new Date(startDate)
    const eDate = new Date(endDate)

    const diffTime = Math.abs(eDate - fDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

const addDays = (day, count) => {
    const current = new Date(day)
    current.setDate(current.getDate() + count - 1)
    return current
}

export { getDayName, getFormattedDate, getDateRange, getDateCount, getGlobalDateString, addDays }