const TouchComponent = require('../../lib/touchcomponent.js')

function Layout3Row1Col(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

Layout3Row1Col.prototype = Object.create(TouchComponent.prototype)
Layout3Row1Col.prototype.name = 'layout3row1col'
Layout3Row1Col.prototype.constructor = Layout3Row1Col

module.exports = Layout3Row1Col
