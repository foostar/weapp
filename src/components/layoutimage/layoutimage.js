const Component = require('../../lib/component')

function LayoutImage(key, module) {
    Component.call(this, key)
    this.data = {
        title: module.extParams.styleHeader.title,
        position: module.extParams.styleHeader.position,
        showTitle: module.extParams.styleHeader.isShow
    }
    this.addByModule(module.componentList)
}

LayoutImage.prototype = Object.create(Component.prototype)
LayoutImage.prototype.name = 'layoutimage'
LayoutImage.prototype.constructor = LayoutImage

module.exports = LayoutImage
