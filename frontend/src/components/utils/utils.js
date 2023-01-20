import { startOfISOWeek, endOfISOWeek, format, startOfMonth, endOfMonth, getISODay } from 'date-fns'

export const DateConvert = (date) => {
    return date.split('-').reverse().join('-');
}

export const GetCurrentDate = (date) => {
    const currentDate = date
    const yyyy = currentDate.getFullYear()
    const mm = currentDate.getMonth() + 1
    const dd = currentDate.getDate()
    const stringDate = [yyyy, (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join("-")
    return stringDate
}

export const GetCurrentWeek = () => {
    const currentDate = new Date()
    const firstday = format(startOfISOWeek(currentDate), 'yyyy-MM-dd')
    const lastday = format(endOfISOWeek(currentDate), 'yyyy-MM-dd')
    return ({ firstday: firstday, lastday: lastday })
}

export const GetCurrentMonth = () => {
    const currentDate = new Date()
    const firstday = format(startOfMonth(currentDate), 'yyyy-MM-dd')
    const lastday = format(endOfMonth(currentDate), 'yyyy-MM-dd')
    return ({ firstday: firstday, lastday: lastday })
}

export const GetStartMonth = (date) => {
    const currentDate = date
    const startMonthDay = format(startOfMonth(currentDate), 'yyyy-MM-dd')
    return startMonthDay
}

export const GetWeekDay = (date) => {
    const dayNumber = getISODay(new Date(date))
    const days = {
        1: "Пн",
        2: "Вт",
        3: "Ср",
        4: "Чт",
        5: "Пт",
        6: "Сб",
        7: "Вс"
    }
    return days[dayNumber]
}

export const getDaysQuantity = (period) => {
    const year = parseInt(period.slice(0, 4))
    const month = parseInt(period.slice(5))
    let days = 0
    const daysObject = {
        1: 31,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    }
    if (month == 2) {
        ((year % 4 == 0) && (year % 100 != 0))
            ? days = 29
            : days = 28
    } else {
        days = daysObject[month]
    }

    return days
}

export const getListOfDays = (period) => {
    const daysQuantity = getDaysQuantity(period)
    let weeksList = []
    let week = []
    for (let i = 1; i <= daysQuantity; i++) {
        let day = period + '-' + (i < 10 ? '0' : '') + i.toString()
        week.push(day)
        if (getISODay(new Date(day)) === 7) {
            weeksList.push(week)
            week = []
        }
    }
    weeksList.push(week)

    return weeksList
}