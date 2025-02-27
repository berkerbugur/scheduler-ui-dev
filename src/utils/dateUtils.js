const getDayName = (date) => {
    return date ? date.toLocaleDateString("en-US", { weekday: 'long' }) : null;
}

const getFormattedDate = (date) => {
    return date ? date.toLocaleDateString("de-DE", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }) : null;
}

const getDateRange = (startDate, endDate) => {
    if (!startDate || !endDate)
        return null

    let dates = []
    const theDate = new Date(startDate)
    while (theDate < endDate) {
        dates = [...dates, new Date(theDate)]
        theDate.setDate(theDate.getDate() + 1)
    }
    dates = [...dates, endDate]
    return dates
}

const getDateCount = (startDate, endDate) => {
    let dayCount = 0;
    const diffTime = Math.abs(endDate - startDate);
    dayCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return dayCount;
}

export { getDayName, getFormattedDate, getDateRange, getDateCount }