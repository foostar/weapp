const TouchComponent = require('../../lib/touchcomponent')

function LayoutSlider(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

LayoutSlider.prototype = Object.create(TouchComponent.prototype)
LayoutSlider.prototype.name = 'layoutslider'
LayoutSlider.prototype.constructor = LayoutSlider

module.exports = LayoutSlider
