const Component = require('../../lib/component')
const components = require('../../lib/components')

function LayoutSlider(key, module) {
    Component.call(this, key)

    this.data = {
        componentList: module.componentList
    }
}

LayoutSlider.prototype = Object.create(Component.prototype)
LayoutSlider.prototype.name = 'layoutslider'
LayoutSlider.prototype.constructor = LayoutSlider

module.exports = LayoutSlider
