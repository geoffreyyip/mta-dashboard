const filterByRoutes = function(advisories, routesToKeep = []) {
  if (routesToKeep.length === 0) return advisories
  return routesToKeep.reduce((result, route) => {
    result[route] = advisories[route]
    return result
  }, {})
}

// lock in a set of routes via partial application
// TODO: ignore routes that aren't official subway routes
// TODO: throw an error when no argument is supplied
exports.makeRoutesFilter = function(routesToKeep = []) {
  return function(advisories) {
    return filterByRoutes(advisories, routesToKeep)
  }
}

exports.removeDuplicates = function(advisories) {
  const routes = Object.keys(advisories)

  // tracks which messages have already been used
  const used = new Set()
  const isDuplicate = item => used.has(item)
  const markAsUsed = item => used.add(item)

  return routes.reduce((result, route) => {
    const advisory = advisories[route]
    result[route] = advisory.filter(message => {
      const item = JSON.stringify(message)
      if (isDuplicate(item)) return false

      markAsUsed(item)
      return true
    })
    return result
  }, {})
}

exports.flattenToArray = function(advisories) {
  const routes = Object.keys(advisories)

  return routes.reduce((result, route) => {
    const advisory = advisories[route]
    advisory.forEach(message => {
      result.push(message)
    })
    return result
  }, [])
}
