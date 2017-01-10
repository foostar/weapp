const Component = require('../../lib/component.js')

function LayoutImage(key, module) {
    Component.call(this, key)
    this.data = {
        title: module.extParams.styleHeader.title,
        position: module.extParams.styleHeader.position,
        showTitle: module.extParams.styleHeader.isShow,
        isShowMore: module.extParams.styleHeader.isShowMore,
        moreComponent: module.extParams.styleHeader.isShowMore ? module.extParams.styleHeader.moreComponent : {}
    }
    this.addByModule(module.componentList)
}

LayoutImage.prototype = Object.create(Component.prototype)
LayoutImage.prototype.name = 'layoutimage'
LayoutImage.prototype.constructor = LayoutImage

LayoutImage.prototype.touch = function () {
    const { moreComponent } = this.data
    wx.navigateTo({
        url: `/pages/blank/blank?type=${moreComponent.type}&data=${JSON.stringify(moreComponent)}`
    })
}

module.exports = LayoutImage
