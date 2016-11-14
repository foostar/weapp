const Component = require('../../lib/component')
const util = require('../../utils/util.js')

var app = getApp()
function LayoutNewsAuto(key, module) {
    Component.call(this, key)
    const componentList = util.formatListData(module.componentList)
    componentList.map((v) => {
        v.last_reply_date = util.dateFormat(v.last_reply_date, 'yyyy-MM-dd')
        let faceResult = util.infoToFace(v.subject)
        v.hasFace = faceResult.hasFace
        v.subject = faceResult.data
        return v
    })
    this.data = {
        style: module.style,
        componentList
    }
}

LayoutNewsAuto.prototype = Object.create(Component.prototype)
LayoutNewsAuto.prototype.name = 'layoutnewsauto'
LayoutNewsAuto.prototype.constructor = LayoutNewsAuto

LayoutNewsAuto.prototype.clickItem = function (e) {
    if (e.target.dataset.role == 'avatar') {
        if (app.isLogin()) return
        return wx.navigateTo({
            url: `/pages/blank/blank?type=userhome&data=${JSON.stringify({ uid: e.currentTarget.dataset.user })}`
        })
    }
    app.showPost(e.currentTarget.id)
}
module.exports = LayoutNewsAuto
