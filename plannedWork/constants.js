const _ = require('lodash')

// Service advisory link
exports.baseURL =
  'http://travel.mtanyct.info/serviceadvisory/routeStatusResult.aspx'

// MongoDB url
exports.dbURL =
  'mongodb://heroku_q0wnv9k0:r8lguve6kh0u47vifn400950jr@ds127949.mlab.com:27949/heroku_q0wnv9k0'

// Subway lines
exports.canonicalSubwayRoutes = canonicalSubwayRoutes = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  'A',
  'C',
  'E',
  'B',
  'D',
  'F',
  'M',
  'G',
  'J',
  'Z',
  'L',
  'N',
  'Q',
  'R',
  'W',
  'GS',
  'FS',
  'H',
]

/**
 * maps canonical routes to their subway user equivalents
 *
 * this takes care of strange canonical routes like 'GS',
 * 'FS' and 'H' which all map to the S train.
 */
function getUserRouteMap(canonicalRoutes) {
  return canonicalRoutes.reduce((mapping, route) => {
    switch (route) {
      case 'GS':
      case 'FS':
      case 'H':
        mapping[route] = 'S'
        break
      default:
        mapping[route] = route
    }
    return mapping
  }, {})
}

const userRouteMap = getUserRouteMap(canonicalSubwayRoutes)

exports.userSubwayRoutes = _.uniq(Object.values(userRouteMap))

function generateImageMap(arr) {
  /**
   * The Service Adivsory link uses <img src="images/*.png">
   * tags to denote specific routes. This mapping helps us
   * detect those image tags and replace them with
   * corresponding text.
   *
   * (E.g. "images/A.png": "A")
   */
  var rawMap = arr.reduce((pairs, canonicalRoute) => {
    const userRoute = userRouteMap[canonicalRoute]
    pairs[`images/${canonicalRoute}.png`] = userRoute
    return pairs
  }, {})

  return rawMap
}

exports.imgMap = generateImageMap(canonicalSubwayRoutes)
