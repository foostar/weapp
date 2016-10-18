const Component = require('../../lib/component')
const components = require('../../lib/components')

function LayoutImage(key, module) {
    Component.call(this, key)
    module.componentList.forEach((m) => {
        this.add(components.create(m))
    })
    this.data = {
        components: components.template,
        componentList: module.componentList
    }
}

LayoutImage.prototype = Object.create(Component.prototype)
LayoutImage.prototype.name = 'layoutimage'
LayoutImage.prototype.constructor = LayoutImage

module.exports = LayoutImage
