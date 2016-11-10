const Component = require('../../lib/component')

function LayoutDefault(key, module) {
    Component.call(this, key)
    this.data = {
        title: module.extParams.styleHeader.title,
        position: module.extParams.styleHeader.position,
        showTitle: module.extParams.styleHeader.isShow
    }
    this.addByModule(module.componentList)
}

LayoutDefault.prototype = Object.create(Component.prototype)
LayoutDefault.prototype.name = 'layoutdefault'
LayoutDefault.prototype.constructor = LayoutDefault

module.exports = LayoutDefault
