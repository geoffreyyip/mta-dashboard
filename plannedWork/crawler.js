const moment = require('moment')

const scraper = require('./scraper')
const DateRange = require('./DateRange')
const { baseURL, canonicalSubwayRoutes: routes } = require('./constants.js')

function buildLink({ route, datetime }) {
  const date = moment(datetime)
  const dateString = date.format('MM/DD/YYYY')

  return `${baseURL}?tag=${route}&date=${dateString}&time=&method=getstatus4`
}

function advisoriesByDate(datetime) {
  // reject past dates; mta only responds to present / future date queries
  if (moment(datetime).isBefore(Date.now(), 'day')) {
    throw new Error('advisoriesByDate invoked with invalid date')
  }

  const pages = routes.map(route => {
    const link = buildLink({ route, datetime })
    return scraper(link)
  })

  // each advisory can have multiple messages
  const messagesByRoute = {}
  return Promise.all(pages).then(advisories => {
    advisories.forEach((advisory, index) => {
      const route = routes[index]
      messagesByRoute[route] = advisory
    })
    return messagesByRoute
  })
}

/**
 * Scrapes service advisories across multiple date ranges
 *
 * @param Number num - How many results to return
 * @param Date from - Which date to start with
 * @return Array[Object] - Batches of work for a specified
 *   date range
 */
async function getWorkBatches(num = 3, from = Date.now()) {
  const batches = []
  const start = new DateRange(from)

  for (let offset = 0; offset < num; offset++) {
    const dateRange = start.next(offset)
    batches.push({
      type: dateRange.type,
      start: dateRange.start.toDate(),
      end: dateRange.end.toDate(),
    })
  }

  return Promise.all(
    batches.map(async batch => {
      const advisories = await advisoriesByDate(batch.end)
      return Object.assign({}, batch, { advisories })
    })
  )
}

module.exports = getWorkBatches
