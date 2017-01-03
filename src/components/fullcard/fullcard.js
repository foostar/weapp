const Component = require('../../lib/component.js')

function Fullcard(key, module) {
    Component.call(this, key)
    this.module = module
    this.addByModule(module.componentList[0])
    this.data = {
        module: module.componentList[0]
    }
}

Fullcard.prototype = Object.create(Component.prototype)
Fullcard.prototype.name = 'fullcard'
Fullcard.prototype.constructor = Fullcard

module.exports = Fullcard
