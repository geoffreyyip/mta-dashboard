const nunjucks = require('nunjucks');
const {
  imgMap,
} = require('./getPlannedWork/constants');

// matches `<img src="images/ROUTE.png">`
const isImage = ({name, attribs}) => {
  return name === 'img' && /images\/.*\.png/.test(attribs.src);
}

/**
 * gets the ROUTE out of `<img src ="images/ROUTE.png">`
 * returns null when image is not a route
 */
const extractRoute = (node) => {
  const src = node.attribs.src;
  return imgMap[src];
}

// formats native date objects as "Mon Jun 12
const shortenDate = (date) => {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

module.exports = function setup(app) {
  const env = nunjucks.configure('./views', {
      autoescape: true,
      express: app
  });

  env.addFilter('isImage', isImage);
  env.addFilter('extractRoute', extractRoute);
  env.addFilter('shortenDate', shortenDate);
}

