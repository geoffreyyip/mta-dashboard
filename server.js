const express = require('express');
const nunjucks = require('nunjucks');

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
  res.render('index.html');
});

app.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}`)
})
