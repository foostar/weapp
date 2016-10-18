const Component = require('../../lib/component')
const components = require('../../lib/components')

const app = getApp()

function Custom(key, module) {
    Component.call(this, key)
    app.api.custom(module.id).then(data => {
        Object.assign(module, data.body.module)
        module.componentList.forEach((m) => {
            this.add(components.create(m))
        })
        this.setData({
            components: components.template,
            componentList: module.componentList
        })
    })
}

Custom.prototype = Object.create(Component.prototype)
Custom.prototype.name = 'custom'
Custom.prototype.constructor = Custom

module.exports = Custom
