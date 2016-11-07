const Component = require('../../lib/component')

function SubnavCustom(key, module) {
    Component.call(this, key)
    this.addByModule(module.componentList)
}

SubnavCustom.prototype = Object.create(Component.prototype)
SubnavCustom.prototype.name = 'subnavcustom'
SubnavCustom.prototype.constructor = SubnavCustom

module.exports = SubnavCustom
