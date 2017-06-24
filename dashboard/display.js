const express = require('express')
const router = new express.Router()

const nextBusArrivals = require('../busArrivals/nextBusArrivals')
const plannedWork = require('../plannedWork/query')

const {
  cleanSubwayData,
  filterByRoutes,
} = require('../subwayDelays/cleanser.js')

const displayDashboard = async (req, res) => {
  const { busRoute, busStop, subwayRoutes } = req.query

  try {
    const [arrivals, subwayDelays] = await Promise.all([
      nextBusArrivals(busRoute, busStop),
      filterByRoutes(cleanSubwayData(await plannedWork), subwayRoutes),
    ])

    res.render('dashboard.html', { arrivals, subwayDelays })
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .send('500 (INTERNAL SERVER ERROR) Something broke on our end!')
  }
}

router.get('/dashboard', displayDashboard)

module.exports = router
