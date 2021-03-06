const Component = require('../../lib/component.js')

function LayoutTransparent(key, module) {
    Component.call(this, key)
    this.addByModule(module.componentList)
}

LayoutTransparent.prototype = Object.create(Component.prototype)
LayoutTransparent.prototype.name = 'layouttransparent'
LayoutTransparent.prototype.constructor = LayoutTransparent

module.exports = LayoutTransparent
