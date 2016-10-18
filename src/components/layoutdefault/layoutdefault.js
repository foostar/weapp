const Component = require('../../lib/component')
const components = require('../../lib/components')

function LayoutDefault(key, module) {
    Component.call(this, key)
    module.componentList.forEach((m) => {
        this.add(components.create(m))
    })
    this.data = {
        components: components.template,
        componentList: module.componentList
    }
}

LayoutDefault.prototype = Object.create(Component.prototype)
LayoutDefault.prototype.name = 'layoutdefault'
LayoutDefault.prototype.constructor = LayoutDefault

module.exports = LayoutDefault
