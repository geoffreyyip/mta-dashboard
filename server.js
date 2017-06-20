const express = require('express');
const compression = require('compression');
const registerNunjucks = require('./registerNunjucks');

const nextBusArrivals = require('./busArrivals/nextBusArrivals');
const plannedWork = require('./getPlannedWork/query');

const {
  cleanSubwayData,
  filterByRoutes,
} = require('./subwayDelays/cleanser.js');

const app = express();

// templating engine
registerNunjucks(app);

// gzip compression
app.use(compression());

app.set('port', process.env.PORT || 4444);

// routes
app.get('/dashboard', async (req, res) => {
  const {
    busRoute,
    busStop,
    subwayRoutes,
  } = req.query;

  try {
    const [arrivals, subwayDelays] = await Promise.all([
      nextBusArrivals(busRoute, busStop),
      filterByRoutes(cleanSubwayData(await plannedWork), subwayRoutes),
    ]);

    res.render('dashboard.html', { arrivals, subwayDelays });
  } catch(err) {
    console.log(err);
    res.status(500).send('500 (INTERNAL SERVER ERROR) Something broke on our end!');
  }
});

app.use(require('./dashboard/settings'));
app.use(express.static('public'));

app.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}`)
})
