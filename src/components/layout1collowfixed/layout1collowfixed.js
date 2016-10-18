const Component = require('../../lib/component')

function Layout1ColLowFixed(key, module) {
    Component.call(this, key)
    this.data = {
        componentList: module.componentList
    }
}

Layout1ColLowFixed.prototype = Object.create(Component.prototype)
Layout1ColLowFixed.prototype.name = 'layout1collowfixed'
Layout1ColLowFixed.prototype.constructor = Layout1ColLowFixed

module.exports = Layout1ColLowFixed
