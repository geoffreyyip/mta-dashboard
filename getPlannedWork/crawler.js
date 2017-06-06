const moment = require('moment');

const scraper = require('./scraper');
const DateRange = require('./DateRange');
const { baseURL, routes, imgMap } = require('./constants.js');

function buildLink({ route, datetime }) {
  const date = moment(datetime);
  return `${baseURL}?tag=${route}&date=${date.format('MM/DD/YYYY')}&time=&method=getstatus4`;
}

function advisoriesByDate(datetime) {
  const pages = routes.map((route) => {
    const link = buildLink({ route, datetime });
    return scraper(link);
  });

  // each advisory can have multiple messages
  const messagesByRoute = {};
  return Promise.all(pages)
    .then((advisories) => {
      advisories.forEach((advisory, index) => {
        const route = routes[index];
        messagesByRoute[route] = advisory;
      });
      return messagesByRoute;
    });
}

/**
 * Scrapes service advisories across multiple date ranges
 *
 * @param Number num - How many results to return
 * @param Date from - Which date to start with
 * @return Array[Object] - Batches of work for a specified
 *   date range
 */
function getWorkBatches(num=3, from=Date.now()) {
  const batches = [];
  const start = new DateRange(from);

  for (let offset = 0; offset < num; offset++) {
    const dateRange = start.next(offset);
    const advisories = advisoriesByDate(dateRange.start);
    batches.push(Promise.resolve(advisories)
      .then((advisories) => ({
        type: dateRange.type,
        start: dateRange.start,
        end: dateRange.end,
        advisories,
      })))
  }

  return Promise.all(batches)
}

module.exports = getWorkBatches;
