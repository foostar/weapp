const TouchComponent = require('../../lib/touchcomponent')

function Layout3Col(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

Layout3Col.prototype = Object.create(TouchComponent.prototype)
Layout3Col.prototype.name = 'layout3col'
Layout3Col.prototype.constructor = Layout3Col

module.exports = Layout3Col
