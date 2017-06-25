const filterByRoutes = function filterByRoutes(advisories, routesToKeep = []) {
  if (routesToKeep.length === 0) return advisories
  return routesToKeep.reduce((result, route) => {
    const routeToKeep = { [route]: advisories[route] }
    return Object.assign({}, result, routeToKeep)
  }, {})
}

// lock in a set of routes via partial application
// TODO: ignore routes that aren't official subway routes
// TODO: throw an error when no argument is supplied
exports.makeRoutesFilter = function makeRoutesFilter(routesToKeep = []) {
  return advisories => filterByRoutes(advisories, routesToKeep)
}

exports.removeDuplicates = function removeDuplicates(advisories) {
  const routes = Object.keys(advisories)

  // tracks which messages have already been used
  const used = new Set()
  const isDuplicate = item => used.has(item)
  const markAsUsed = item => used.add(item)

  return routes.reduce((result, route) => {
    const advisory = advisories[route]
    const distinct = advisory.filter(message => {
      const item = JSON.stringify(message)
      if (isDuplicate(item)) return false

      markAsUsed(item)
      return true
    })
    const newAdvisory = { [route]: distinct }
    return Object.assign({}, result, newAdvisory)
  }, {})
}

exports.flattenToArray = function flattenToArray(advisories) {
  const routes = Object.keys(advisories)

  return routes.reduce((result, route) => {
    const advisory = advisories[route]
    advisory.forEach(message => {
      result.push(message)
    })
    return result
  }, [])
}
