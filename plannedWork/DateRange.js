const moment = require('moment')

const MONDAY = 1
const FRIDAY = 5
const SATURDAY = 6
const SUNDAY = 7

class DateRange {
  constructor(date) {
    const datetime = moment(date)
    this.type = this.getType(datetime)

    if (this.type === 'workday') {
      this.start = moment(datetime).isoWeekday(MONDAY)
      this.end = moment(datetime).isoWeekday(FRIDAY)
    } else {
      this.start = datetime.clone().isoWeekday(SATURDAY)
      this.end = datetime.clone().isoWeekday(SUNDAY)
    }
  }

  next(offset = 1) {
    const changeType = offset % 2 === 1
    const weeksToAdd = Math.floor(offset / 2)

    const nextStart = this.start.clone()

    if (changeType) {
      if (this.type === 'workday') nextStart.isoWeekday(SATURDAY)
      else if (this.type === 'weekend') {
        nextStart.add(1, 'week').isoWeekday(MONDAY)
      }
    }

    nextStart.add(weeksToAdd, 'week')

    return new DateRange(nextStart)
  }

  getType(date) {
    if (this.isWorkday(date)) return 'workday'
    return 'weekend'
  }

  isWorkday(date) {
    return date.isoWeekday() < SATURDAY
  }

  isWeekend(date) {
    return date.isoWeekday() >= SATURDAY
  }
}

module.exports = DateRange
