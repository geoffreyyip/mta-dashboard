const moment = require('moment');

const plannedWork = require('./plannedWork');
const { baseURL, routes, imgMap } = require('./constants.js');

function buildLink({ route, datetime }) {
  const date = moment(datetime);
  return `${baseURL}?tag=${route}&date=${date.format('MM/DD/YYYY')}&time=&method=getstatus4`;
}

function plannedWorkByDate(datetime) {
  const pages = routes.map((route) => {
    const link = buildLink({ route, datetime });
    return plannedWork(link);
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
}

module.exports = plannedWorkByDate;
