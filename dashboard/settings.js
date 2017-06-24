const express = require('express')
const router = new express.Router()

const { userSubwayRoutes } = require('../plannedWork/constants')

router.get('/', (req, res) => {
  res.render('settings.html', {
    subwayRoutes: userSubwayRoutes,
  })
})

module.exports = router
