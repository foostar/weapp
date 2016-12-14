const Component = require('../../lib/component.js')

const app = getApp()

function Custom(key, module) {
    Component.call(this, key)
    app.api.custom(module.id).then((data) => {
        Object.assign(module, data.body.module)
        this.addByModule(module.componentList)
    })
}

Custom.prototype = Object.create(Component.prototype)
Custom.prototype.name = 'custom'
Custom.prototype.constructor = Custom


module.exports = Custom
