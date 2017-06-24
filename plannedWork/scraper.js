const axios = require('axios')
const htmlparser = require('htmlparser2')

// matches `<a onclick="ShowHide(NUMBER);"><a/>`
const isTitleTag = (name, attribs) => {
  return name === 'a' && /ShowHide\((\d+)\);/.test(attribs.onclick)
}

// matches `<img src="images/ROUTE.png">`
const isRouteImage = (name, attribs) => {
  return name === 'img' && /images\/.*\.png/.test(attribs.src)
}

class Transcriber {
  constructor() {
    this.message = []
    this.running = false
  }

  start() {
    this.running = true
  }

  add(item) {
    this.message.push(item)
  }

  stop() {
    this.running = false
  }
}

/**
 * extracts the content from Advisory Work title tags
 *
 * retrieves the <img> tags and text in a flat array, and
 * ignores the DOM tree, similiar to how the web API
 * `Node.textContent` functions
 *
 * @return Array[Object] Flat array of <img> and text nodes
 */
function getTitles(html) {
  const titles = []
  let record = new Transcriber()

  let entryDepth
  let currDepth = 0

  const titleParser = new htmlparser.Parser(
    {
      onopentag: (name, attribs) => {
        if (isTitleTag(name, attribs)) {
          record.start()
          entryDepth = currDepth
        } else if (record.running && isRouteImage(name, attribs))
          record.add({
            name,
            attribs,
          })
        currDepth++
      },
      ontext: str => {
        if (record.running)
          record.add({
            type: 'text',
            data: str,
          })
      },
      onclosetag: name => {
        currDepth--
        if (currDepth === entryDepth) {
          entryDepth = null
          record.stop()
          titles.push(record.message)
          record = new Transcriber()
        }
      },
    },
    { decodeEntities: true }
  )

  titleParser.write(html)
  titleParser.end()
  return titles
}

module.exports = function plannedWork(resultsPage) {
  return axios(resultsPage).then(res => getTitles(res.data))
}
