import { startOfISOWeek, endOfISOWeek, format, startOfMonth  } from 'date-fns'

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

export const GetStartMonth = (date) => {
    const currentDate = date
    const startMonthDay = format(startOfMonth(currentDate), 'yyyy-MM-dd')
    return startMonthDay
}
