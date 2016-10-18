const Component = require('../../lib/component')

function LayoutSlider(key, module) {
    Component.call(this, key)

    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

LayoutSlider.prototype = Object.create(Component.prototype)
LayoutSlider.prototype.name = 'layoutslider'
LayoutSlider.prototype.constructor = LayoutSlider

module.exports = LayoutSlider
