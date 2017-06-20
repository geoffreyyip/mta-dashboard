const express = require('express');
const compression = require('compression');
const registerNunjucks = require('./registerNunjucks');

const app = express();

// templating engine
registerNunjucks(app);

// gzip compression
app.use(compression());

// routing
app.use(require('./dashboard/settings'));
app.use(require('./dashboard/display'));
app.use(express.static('public'));

// start listening
app.set('port', process.env.PORT || 4444);
app.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}`)
})
