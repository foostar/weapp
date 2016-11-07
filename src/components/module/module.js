const Component = require('../../lib/component')

const app = getApp()

function Module(key, module) {
    Component.call(this, key)
    module = app.globalData.modules[module.extParams.moduleId]
    this.addByModule(module)
    this.data = { moduleId: module.id }
}

Module.prototype = Object.create(Component.prototype)
Module.prototype.name = 'module'
Module.prototype.constructor = Module

// Viewer.prototype.handleTouch = function (event) {
//     this.parent.selectTab(Number(event.currentTarget.dataset.index))
// }

module.exports = Module
