const TouchComponent = require('../../lib/touchcomponent')

function Layout1Row1Col(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

Layout1Row1Col.prototype = Object.create(TouchComponent.prototype)
Layout1Row1Col.prototype.name = 'layout1row1col'
Layout1Row1Col.prototype.constructor = Layout1Row1Col

module.exports = Layout1Row1Col
