// Service advisory link
exports.baseURL = 'http://travel.mtanyct.info/serviceadvisory/routeStatusResult.aspx';

// Subway lines
exports.routes = routes = [
  '1', '2', '3',
  '4', '5', '6',
  '7',
  'A', 'C', 'E',
  'B', 'D', 'F', 'M',
  'G',
  'J', 'Z',
  'L',
  'N', 'Q', 'R', 'W',
  'SIR',
  'GS', 'FS', 'H',
];

function generateImageMap(arr) {
  /**
   * The Service Adivsory link uses <img src="images/*.png">
   * tags to denote specific routes. This mapping helps us
   * detect those image tags and replace them with
   * corresponding text.
   *
   * (E.g. "images/A.png": "A")
   */
  var rawMap = arr.reduce((pairs, route) => {
    pairs[`images/${route}.png`] = route;
    return pairs;
  }, {});

  // TODO: Hardcode stuff like "images/GS": "S"
  return rawMap;
}

exports.imgMap = generateImageMap(routes);
