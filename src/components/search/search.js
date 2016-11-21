const Component = require('../../lib/component')
// const { dateFormat, infoToFace } = require('../../utils/util.js')

// const app = getApp()

function Search(key) {
    Component.call(this, key)
    this.data = {
    }
}

Search.prototype = Object.create(Component.prototype)
Search.prototype.name = 'search'
Search.prototype.constructor = Search


module.exports = Search
