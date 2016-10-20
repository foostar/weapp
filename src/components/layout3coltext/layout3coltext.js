const Component = require('../../lib/component')

function Layout3ColText(key, module) {
    Component.call(this, key)
    this.data = {
        componentList: module.componentList
    }
}

Layout3ColText.prototype = Object.create(Component.prototype)
Layout3ColText.prototype.name = 'layout3coltext'
Layout3ColText.prototype.constructor = Layout3ColText

module.exports = Layout3ColText
