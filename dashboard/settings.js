const express = require('express');
const router = new express.Router();

const { userSubwayRoutes } = require('../getPlannedWork/constants');

router.get('/', (req, res) => {
  res.render('settings.html', {
    subwayRoutes: userSubwayRoutes,
  });
});

module.exports = router;
