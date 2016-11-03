const TouchComponent = require('../../lib/touchcomponent')

function DiscoverCustom(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        list: module.componentList
    }
}

DiscoverCustom.prototype = Object.create(TouchComponent.prototype)
DiscoverCustom.prototype.name = 'discovercustom'
DiscoverCustom.prototype.constructor = DiscoverCustom
module.exports = DiscoverCustom
