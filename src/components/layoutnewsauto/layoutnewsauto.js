const Component = require('../../lib/component.js')
const util = require('../../utils/util.js')

var app = getApp()
function LayoutNewsAuto(key, module) {
    Component.call(this, key)
    const componentList = util.formatListData(module.componentList)
    componentList.map((v) => {
        v.last_reply_date = util.dateFormat(v.last_reply_date, 'yyyy-MM-dd')
        v.subject = util.formateText(v.subject)
        let faceResult = util.infoToFace(v.subject)
        v.hasFace = faceResult.hasFace
        v.subject = faceResult.data
        v.type = 'post'
        v.images = (v.imageList && v.imageList.length > 0 && v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))) || new Array(v.pic_path) || []
        if (v.source_type == 'news') {
            v.type = 'article'
            v.topicId = v.articleId
        }
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
        if (e.currentTarget.dataset.user) {
            return app.showUserHome(e.currentTarget.dataset.user)
        }
        const showError = () => {
            this.setData({
                isShow: true,
                errMessage: '此用户为匿名用户，不可查看！'
            })
            setTimeout(() => {
                this.setData({
                    isShow: false
                })
            }, 800)
        }
        return showError()
    }
    app.showPost({ type: e.currentTarget.dataset.type, id: e.currentTarget.id })
}
module.exports = LayoutNewsAuto
