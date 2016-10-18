const Component = require('../../lib/component')
const components = require('../../lib/components')

function LayoutFourCol(key, module) {
    Component.call(this, key)

    this.data = {
        componentList: module.componentList
    }
}

LayoutFourCol.prototype = Object.create(Component.prototype)
LayoutFourCol.prototype.name = 'layoutfourcol'
LayoutFourCol.prototype.constructor = LayoutFourCol

module.exports = LayoutFourCol
