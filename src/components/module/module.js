const Component = require('../../lib/component')
const components = require('../../lib/components')

function Module(key, module) {
    Component.call(this, key)
    // this.add(new components.type[`${module.type}-${module.style}`](`m_${module.id}`, module))
    // this.data = {
    //     components: components.template
    // }
}

Module.prototype = Object.create(Component.prototype)
Module.prototype.name = 'module'
Module.prototype.constructor = Module

// Viewer.prototype.handleTouch = function (event) {
//     this.parent.selectTab(Number(event.currentTarget.dataset.index))
// }

module.exports = Module
