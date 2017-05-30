const express = require('express');
const nunjucks = require('nunjucks');

const nextBusArrivals = require('./api/nextBusArrivals');

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
  // hard-coded for sanity testing
  nextBusArrivals('MTA NYCT_B63', 308209)
    .then((arrivals) => {
      res.render('index.html', {arrivals});
    });
});

app.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}`)
})
