const express = require('express');
const nunjucks = require('nunjucks');

const nextBusArrivals = require('./api/nextBusArrivals');
const plannedWork = require('./getPlannedWork/query');

const app = express();

app.set('port', process.env.PORT || 4444);

// setup template engine
nunjucks.configure('./', {
    autoescape: true,
    express: app
});

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
