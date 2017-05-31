const axios = require('axios');
const moment = require('moment');

const {keys, bustime} = require("./config.js");

function buildRequest(route, stop, maxResults) {
  return {
    baseURL: 'http://bustime.mta.info/api/siri/stop-monitoring.json',
    params: {
      key: keys.BUSTIME_KEY,
      version: 2,
      StopMonitoringDetailLevel: 'min',
      OperatorRef: 'MTA',
      LineRef: route,
      MonitoringRef: stop,
      MaximumStopVisits: maxResults,
    }
  }
}

// drills down into MTA response to get the relevant info
function getMonitoredVehicleJourneys(data) {
  /**
   * @return Array - Contains info on origin,
   *   destination, and current location
   */
  return data
    .Siri
    .ServiceDelivery
    .StopMonitoringDelivery[0]
    .MonitoredStopVisit.map(item => item.MonitoredVehicleJourney);
}

function extractArrivalInfo(journeys) {
  /**
   * @return Array - Human-readable info on how
   *   far the bus is time-wise and distance-wise
   *
   *   @property String routeName
   *   @property String stopName
   *   @property String waitTime
   *   @property String distance
   */
  return journeys.map((journey) => {
    const realtime = journey.MonitoredCall;
    return {
      routeName: journey.PublishedLineName[0],
      stopName: realtime.StopPointName[0],
      waitTime: moment(realtime.ExpectedArrivalTime).fromNow(),
      distance: realtime.ArrivalProximityText,
    }
  });
}

function nextBusArrivals(route, stop, maxResults=2) {
  const url = buildRequest(route, stop, maxResults);

  return axios(url)
    .then(response => response.data)
    .then(getMonitoredVehicleJourneys)
    .then(extractArrivalInfo)
    .catch((error) => {
      console.error(error);
    })
}

module.exports = nextBusArrivals;
