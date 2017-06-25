const express = require('express')
const { userSubwayRoutes } = require('../plannedWork/constants')

const router = new express.Router()

router.get('/', (req, res) => {
  res.render('settings.html', {
    subwayRoutes: userSubwayRoutes,
  })
})

module.exports = router
