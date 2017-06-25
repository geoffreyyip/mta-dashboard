const { makeRoutesFilter, removeDuplicates } = require('./filters.js')

/**
 * returns an exact copy of the passed in object but with one
 * property changed
 */
const applyFilter = function(filter, object, prop) {
  return Object.assign({}, object, { [prop]: filter(object[prop]) })
}

// apply multiple filters to a single workBatch
const applyAdvisoryFilters = function(workBatch, filters) {
  // eslint-disable-line no-param-reassign
  if (!Array.isArray(filters)) filters = [filters]

  // filters should be pure functions accepting and returning one object
  return filters.reduce(
    (result, filter) => applyFilter(filter, result, 'advisories'),
    workBatch
  )
}

exports.cleanSubwayData = function(workBatches) {
  return workBatches.map(workBatch =>
    applyAdvisoryFilters(workBatch, [removeDuplicates])
  )
}

exports.filterByRoutes = function(workBatches, routesToKeep) {
  const routesFilter = makeRoutesFilter(routesToKeep)
  return workBatches.map(workBatch =>
    applyAdvisoryFilters(workBatch, [routesFilter])
  )
}
