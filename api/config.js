exports.keys = {
  MTA_KEY: '5e84041677af895e07a7eae591d9eab1',
  BUSTIME_KEY: '484a26db-5c49-4f80-8fb5-4ebeae85f728',
};

/**
 * Bustime API options
 *
 * Queries when the next `{maxResults}` buses will be arriving
 * at the list stop-route pairs.
 *
 * TODO: Allow multiple stop-route pairs. Will need changes here
 * and in ./bustimeAPI.js
 */
exports.bustime = {
  stop: 308209,
  route: 'MTA NYCT_B63',
  maxResults: 2,
}
