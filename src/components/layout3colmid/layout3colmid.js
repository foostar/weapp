const Component = require('../../lib/component')

function Layout3ColMid(key, module) {
    Component.call(this, key)
    this.data = {
        componentList: module.componentList
    }
}

Layout3ColMid.prototype = Object.create(Component.prototype)
Layout3ColMid.prototype.name = 'layout3mid'
Layout3ColMid.prototype.constructor = Layout3ColMid

module.exports = Layout3ColMid
