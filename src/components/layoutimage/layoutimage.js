const Component = require('../../lib/component')

function LayoutImage(key, module) {
    Component.call(this, key)
    this.addByModule(module.componentList)
    this.data = {
        componentList: module.componentList
    }
}

LayoutImage.prototype = Object.create(Component.prototype)
LayoutImage.prototype.name = 'layoutimage'
LayoutImage.prototype.constructor = LayoutImage

module.exports = LayoutImage
