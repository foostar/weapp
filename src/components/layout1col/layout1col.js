const TouchComponent = require('../../lib/touchcomponent')

function Layout1Col(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

Layout1Col.prototype = Object.create(TouchComponent.prototype)
Layout1Col.prototype.name = 'layout1col'
Layout1Col.prototype.constructor = Layout1Col

module.exports = Layout1Col
