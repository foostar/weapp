const Component = require('../../lib/component')
const components = require('../../lib/components')
const app = getApp()

function DiscoverCustom(key, module) {
    Component.call(this, key)
    console.log('hahahah',module)
    module.componentList.map((m) => {
        this.add(components.create(m))
    })
    this.data = {
        list : module.componentList
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
