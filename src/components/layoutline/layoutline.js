const Component = require('../../lib/component.js')

function LayoutLine(key, module) {
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

LayoutLine.prototype = Object.create(Component.prototype)
LayoutLine.prototype.name = 'layoutline'
LayoutLine.prototype.constructor = LayoutLine


LayoutLine.prototype.touch = function () {
    const { moreComponent } = this.data
    wx.navigateTo({
        url: `/pages/blank/blank?type=${moreComponent.type}&data=${JSON.stringify(moreComponent)}`
    })
}

module.exports = LayoutLine
