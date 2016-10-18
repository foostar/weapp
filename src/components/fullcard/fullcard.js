const Component = require('../../lib/component')
const components = require('../../lib/components')

function Fullcard(key, module) {
    Component.call(this, key)
    this.add(components.create(module.componentList[0]))
    console.log(module.componentList[0])
    this.data = {
        module: module.componentList[0],
        components: components.template
    }
}

Fullcard.prototype = Object.create(Component.prototype)
Fullcard.prototype.name = 'fullcard'
Fullcard.prototype.constructor = Fullcard

module.exports = Fullcard
