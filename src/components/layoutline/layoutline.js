const Component = require('../../lib/component')
const components = require('../../lib/components')

function LayoutLine(key, module) {
    Component.call(this, key)
    module.componentList.forEach((m) => {
        this.add(components.create(m))
    })
    this.data = {
        components: components.template,
        componentList: module.componentList
    }
}

LayoutLine.prototype = Object.create(Component.prototype)
LayoutLine.prototype.name = 'layoutline'
LayoutLine.prototype.constructor = LayoutLine

module.exports = LayoutLine
