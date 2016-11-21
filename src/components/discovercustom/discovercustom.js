const TouchComponent = require('../../lib/touchcomponent.js')

const app = getApp()

function DiscoverCustom(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        iconSrc: app.globalData.iconSrc,
        list: module.componentList
    }
}

DiscoverCustom.prototype = Object.create(TouchComponent.prototype)
DiscoverCustom.prototype.name = 'discovercustom'
DiscoverCustom.prototype.constructor = DiscoverCustom
module.exports = DiscoverCustom
