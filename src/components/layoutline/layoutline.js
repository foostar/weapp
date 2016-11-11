const Component = require('../../lib/component')

function LayoutLine(key, module) {
    Component.call(this, key)
    this.data = {
        title: module.extParams.styleHeader.title,
        position: module.extParams.styleHeader.position,
        showTitle: module.extParams.styleHeader.isShow
    }
    this.addByModule(module.componentList)
}

LayoutLine.prototype = Object.create(Component.prototype)
LayoutLine.prototype.name = 'layoutline'
LayoutLine.prototype.constructor = LayoutLine

module.exports = LayoutLine
