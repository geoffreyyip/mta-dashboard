# Developer Notes

## MTA Bus Time

*MTA Bus Time* uses a separate API key from the other MTA services. It is split into the SIRI API and the OneBusAway "Discovery" API. SIRI API gives us real-time data so that's the one we care about.

SIRI API has two main ways of accessing data: Vehicle Monitoring and Stop Monitoring. Both load similar slices of the same data. We care mainly about Stop Monitoring.

### Stop Monitoring

Example call: `http://bustime.mta.info/api/siri/stop-monitoring.json?key={{KEY}}&version=2&MonitoringRef=503691&StopMonitoringDetailLevel=min&MaximumStopVisits=2&LineRef=MTA NYCT_Q24&OperatorRef=MTA`

* **Base URL**: `http://bustime.mta.info/api/siri/stop-monitoring.json`
* **Key**: Personal API key
* **Version**: Defaults to 1, 2 is preferable
* **MonitoringRef**: Stop number
* **StopMonitoringDetailLevel**: In order from succinct to verbose, we have `min`, `basic`, and `normal`. It defaults to `normal`.
* **MaximumStopVisits**: Limits the number of buses to query info for
* **LineRef**: Denotes the bus route. Helps optimize performance even if there's only one bus for a given stop.
* **OperatorRef**: MTA is the only one so far. Helps optimize performance.

### Response

```json
{
  "Siri": {
    "ServiceDelivery": {
      "ResponseTimestamp": "2017-05-16T15:18:13.123-04:00",
      "StopMonitoringDelivery": [
        {
          "MonitoredStopVisit": [
			// ...array of MonitoredVehicleJourney(s)
          ],
          "ResponseTimestamp": "2017-05-16T15:18:13.123-04:00",
          "ValidUntil": "2017-05-16T15:19:13.123-04:00"
        }
      ],
      "SituationExchangeDelivery": []
    }
  }
}
```

Note: `StopMonitoringDelivery[0]` will not contain a `MonitoredStopVisit` on errors. Instead it will contain an `ErrorCondition` property.

### Monitored Vehicle Journey

```JSON
{
  "MonitoredVehicleJourney": {
    "LineRef": "MTA NYCT_B63",
    "DirectionRef": "0",
    "FramedVehicleJourneyRef": {
      "DataFrameRef": "2017-05-16",
      "DatedVehicleJourneyRef": "MTA NYCT_JG_B7-Weekday-SDon-085000_B63_115"
    },
    "JourneyPatternRef": "MTA_B630130",
    "PublishedLineName": [
      "B63"
    ],
    "OperatorRef": "MTA NYCT",
    "OriginRef": "MTA_306619",
    "DestinationRef": "MTA_801130",
    "DestinationName": [
      "PIER 6 BKLYN BRIDGE PK via 5 AV"
    ],
    "SituationRef": [],
    "Monitored": true,
    "VehicleLocation": {
      "Longitude": -73.985804,
      "Latitude": 40.669767
    },
    "Bearing": 49.939217,
    "ProgressRate": "normalProgress",
    "BlockRef": "MTA NYCT_JG_B7-Weekday-SDon_E_JG_17700_B63-101",
    "VehicleRef": "MTA NYCT_381",
    "MonitoredCall": {
      "ExpectedArrivalTime": "2017-05-16T15:25:14.541-04:00",
      "ArrivalProximityText": "0.6 miles away",
      "ExpectedDepartureTime": "2017-05-16T15:25:14.541-04:00",
      "DistanceFromStop": 903,
      "NumberOfStopsAway": 4,
      "StopPointRef": "MTA_308209",
      "VisitNumber": 1,
      "StopPointName": [
        "5 AV/UNION ST"
      ]
    }
  },
  "RecordedAtTime": "2017-05-16T15:17:58.000-04:00"
}
```

MonitoredCall contains the distance info we're interested in.

### Links

* [MTA Bus Time API](http://bustime.mta.info/wiki/Developers/Index)
* [Intro to SIRI API](http://bustime.mta.info/wiki/Developers/SIRIIntro)
* [Stop Monitoring API](http://bustime.mta.info/wiki/Developers/SIRIStopMonitoring)

## Planned Work Scraper

This requires a bit of creative thinking. While an API does exist for recent service delays, no API exists for **Planned Work**. Instead, we can use web scraping to get the information we want.

**Planned Work** web pages are generated dynamically through ASP.net. An example URL: `http://travel.mtanyct.info/serviceadvisory/routeStatusResult.aspx?tag=A&date=5%2f16%2f2017&time=&method=getstatus4`

* **base URL**: `http://travel.mtanyct.info/serviceadvisory/routeStatusResult.aspx`
* **tag**: the specific train we care about
* **date**: when we care about the planned work
* **method** : always equal to `getstatus4`

An example page:

[INSERT IMAGE MANUALLY ONCE THIS IS UPLOADED TO GITHUB]

We can target the appropriate tags using a htmlparse2 script.

```HTML
<a style="cursor:pointer; text-decoration:underline" onclick="ShowHide(1);">
  <b>
    <img src="images/A.png"> Inwood-bound trains skip 135 St, 155 St and 163 St
  </b>
</a>
```

```HTML
<div id="1" style="display:inline;">
  <b></b>
  Late Nights, 11:45 PM to 5 AM, Mon to<b> </b>Fri, May 15 - 19<br><br>
  ...
</div>
```

`scrapers/plannedWork.js` will extract the text content and `<img>` tags as a flat nodes array for the templating engine.
```Javascript
[
  [
    { name: 'img', attribs: { src: 'images/A.png' } },
    { type: 'text', data: 'Jamaica-bound trains skip 14 St and 23 St' },
  ],
  [
    { name: 'img', attribs: { src: 'images/A.png' } },
    { type: 'text', data: 'No trains between Church Av and...' }
  ],
  [
    { name: 'img', attribs: [Object] },
    { type: 'text', data: 'Jamaica-bound trains run local...' }
  ],
]
```

### Database Schema + Technical Definitions

Note: These terms do not necessarily correspond with the MTA's defintions.

At the top, there should be a DateRange Collection:

````json
[
  { id: 1, start: 2017/06/05, end: 2017/06/09, type: 'workday' },
  { id: 2, start: 2017/06/10, end: 2017/06/11, type: 'weekend' },
  ...
]
````

And those DateRange keys should act as foreign keys for an Advisory Collection:

```json
[
  { id: 17, dateRangeId: 1, route: 'A' },
  { id: 18, dateRangeId: 1, route: 'F' },
  ...
  { id: 56, dateRangeId: 3, route: 'G' }
]
```

And those Advisory keys can act as foreign keys for the Message Collection:

```json
[
  { id: 233, advisoryId: 17, message: [json] },
  { id: 234, advisoryId: 17, message: [json] },
  ...
  { id: 378, advisoryId: 56, message: [json] }
]
```

Messages will be a JSON object corresponding to text nodes and route images.

Details are still pending. One possibility is a Heroku Scheduler task to run a Node + Request + Cheerio scraper that persists planned work data through a MongoDB database.
