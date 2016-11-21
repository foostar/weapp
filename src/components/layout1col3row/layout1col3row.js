const TouchComponent = require('../../lib/touchcomponent.js')

function Layout1Col3Row(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

Layout1Col3Row.prototype = Object.create(TouchComponent.prototype)
Layout1Col3Row.prototype.name = 'layout1col3row'
Layout1Col3Row.prototype.constructor = Layout1Col3Row

module.exports = Layout1Col3Row
