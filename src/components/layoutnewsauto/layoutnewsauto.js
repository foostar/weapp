const TouchComponent = require('../../lib/touchcomponent')

function LayoutNewsAuto(key, module) {
    TouchComponent.call(this, key, module)
    console.log(module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

LayoutNewsAuto.prototype = Object.create(TouchComponent.prototype)
LayoutNewsAuto.prototype.name = 'layoutnewsauto'
LayoutNewsAuto.prototype.constructor = LayoutNewsAuto

module.exports = LayoutNewsAuto
