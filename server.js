const express = require('express');
const nunjucks = require('nunjucks');

const nextBusArrivals = require('./api/nextBusArrivals');
const plannedWork = require('./getPlannedWork/query');

const app = express();

app.set('port', process.env.PORT || 4444);

// setup template engine
const env = nunjucks.configure('./', {
    autoescape: true,
    express: app
});

// matches `<img src="images/ROUTE.png">`
env.addFilter('isRouteImage', ({name, attribs}) => {
  return name === 'img' && /images\/.*\.png/.test(attribs.src);
});

// gets the ROUTE out of `<img src ="images/ROUTE.png">`
env.addFilter('extractRoute', (node) => {
  return node.attribs.src.match(/images\/(.*)\.png/)[1];
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
app.get('/', (req, res) => {
  Promise.all([
    nextBusArrivals(req.query.route, req.query.stop),
    plannedWork,
  ])
    .then((values) => {
      const [arrivals, subwayDelays] = values;
      res.render('index.html', { arrivals, subwayDelays });
    })
    .catch(console.log);
});

app.use(express.static('public'));

app.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}`)
})
