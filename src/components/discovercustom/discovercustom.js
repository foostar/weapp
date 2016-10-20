const Component = require('../../lib/component')

function DiscoverCustom(key, module) {
    Component.call(this, key)
    this.addByModule(module.componentList)
    this.data = {
        list: module.componentList
    }
}

DiscoverCustom.prototype = Object.create(Component.prototype)
DiscoverCustom.prototype.name = 'discovercustom'
DiscoverCustom.prototype.constructor = DiscoverCustom

DiscoverCustom.prototype.onLoad = function () {

}
DiscoverCustom.prototype.toNavigationPage = function (e) {
    wx.navigateTo({
        url: `/pages/blank/blank?moduleId=${e.target.dataset.id}`
    })
}
module.exports = DiscoverCustom
