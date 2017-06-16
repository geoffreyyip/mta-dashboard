const express = require('express');
const nunjucks = require('nunjucks');

const nextBusArrivals = require('./api/nextBusArrivals');
const plannedWork = require('./getPlannedWork/query');

const {
  imgMap,
  userSubwayRoutes,
} = require('./getPlannedWork/constants');

const {
  cleanSubwayData,
  filterByRoutes,
} = require('./subwayDelays/cleanser.js');

const app = express();

app.set('port', process.env.PORT || 4444);

// setup template engine
const env = nunjucks.configure('./', {
    autoescape: true,
    express: app
});

// matches `<img src="images/ROUTE.png">`
env.addFilter('isImage', ({name, attribs}) => {
  return name === 'img' && /images\/.*\.png/.test(attribs.src);
});

/**
 * gets the ROUTE out of `<img src ="images/ROUTE.png">`
 * returns null when image is not a route
 */
env.addFilter('extractRoute', (node) => {
  const src = node.attribs.src;
  return imgMap[src];
});

// formats native date objects as "Mon Jun 12"
env.addFilter('shortenDate', (date) => {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
})

app.set('view engine', 'nunjucks');

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

app.get('/', (req, res) => {
  res.render('landing-page.html', {
    subwayRoutes: userSubwayRoutes,
  });
});

app.use(express.static('public'));

app.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}`)
})
