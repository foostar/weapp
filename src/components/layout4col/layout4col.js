const Component = require('../../lib/component')

function Layout4Col(key, module) {
    Component.call(this, key)
    this.data = {
        componentList: module.componentList
    }
}

Layout4Col.prototype = Object.create(Component.prototype)
Layout4Col.prototype.name = 'layout4col'
Layout4Col.prototype.constructor = Layout4Col

module.exports = Layout4Col
