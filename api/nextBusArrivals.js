import axios from 'axios';
import moment from 'moment';

import {keys, bustime} from "./config.js";

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

// synchronous, is called from within the promise
function extractArrivalInfo(data) {
  const stopVisits = data.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit;

  return stopVisits.map((stopVisit) => {
    return stopVisit.MonitoredVehicleJourney.MonitoredCall;
  });
}

function formatArrivalInfo(arrivals) {
  /**
   * @return Array arrivalInfo - Human-readable info on how
   *   far the bus is time-wise and distance-wise
   *
   *   @property String waitTime
   *   @property String distance
   */
  return arrivals.map((bus) => {
    return {
      waitTime: moment(bus.ExpectedArrivalTime).fromNow(),
      distance: bus.ArrivalProximityText,
    }
  });
}

function nextBusArrivals(route, stop, maxResults=2) {
  const url = buildRequest(route, stop, maxResults);

  return axios(url)
    .then(response => response.data)
    .then(extractArrivalInfo)
    .then(formatArrivalInfo)
    .catch((error) => {
      console.error(error);
    })
}

export default nextBusArrivals;
