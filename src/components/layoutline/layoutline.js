const Component = require('../../lib/component')

function LayoutLine(key, module) {
    Component.call(this, key)
    this.addByModule(module.componentList)
}

LayoutLine.prototype = Object.create(Component.prototype)
LayoutLine.prototype.name = 'layoutline'
LayoutLine.prototype.constructor = LayoutLine

module.exports = LayoutLine
