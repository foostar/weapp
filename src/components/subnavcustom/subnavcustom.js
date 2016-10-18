const Component = require('../../lib/component')
const components = require('../../lib/components')

function SubnavCustom(key, module) {
    Component.call(this, key)
    module.componentList.forEach((m) => {
        this.add(components.create(m))
    })
    this.data = {
        components: components.template,
        componentList: module.componentList
    }
}

SubnavCustom.prototype = Object.create(Component.prototype)
SubnavCustom.prototype.name = 'subnavcustom'
SubnavCustom.prototype.constructor = SubnavCustom

module.exports = SubnavCustom
