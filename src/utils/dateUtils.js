const getDayName = (date) => {
    return date ? new Date(date).toLocaleDateString("en-US", { weekday: 'long' }) : null;
}

const getGlobalDateString = (date) => {
    const st = new Date(date).toLocaleDateString("en-US", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    console.log(st);
    return st;
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

    let dayCount = 0;
    const diffTime = Math.abs(eDate - fDate);
    dayCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return dayCount;
}

export { getDayName, getFormattedDate, getDateRange, getDateCount, getGlobalDateString }