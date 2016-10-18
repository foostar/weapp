const Component = require('../../lib/component')
const components = require('../../lib/components')

function LayoutTransparent(key, module) {
    Component.call(this, key)
    module.componentList.forEach((m) => {
        this.add(components.create(m))
    })
    this.data = {
        components: components.template,
        componentList: module.componentList
    }
}

LayoutTransparent.prototype = Object.create(Component.prototype)
LayoutTransparent.prototype.name = 'layouttransparent'
LayoutTransparent.prototype.constructor = LayoutTransparent

module.exports = LayoutTransparent
