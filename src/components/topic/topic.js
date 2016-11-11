/* eslint-disable */
const Component = require('../../lib/component')
const util = require('../../utils/util.js')

const app = getApp()
// 话题页面

function Topic(key, module) {
    if (module.data) {
        this.papeData = module.data
    }
    Component.call(this, key)
    this.data = {
        id: '',
        tpcinfo: {},
        topUser: [],
        partinNum: 0,
        newList: [],
        newPage: 0,
        newTotalNum: 0,
        hotList: [],
        hotPage: 0,
        hotTotalNum: 0,
        color: '#000',
        currentIndex: 0,
        tabs: [ '最新', '最热' ]
    }
}
Topic.prototype = Object.create(Component.prototype)
Topic.prototype.name = 'topic'
Topic.prototype.constructor = Topic

Topic.prototype.onLoad = function () {
    this.setData({
        id: this.papeData.id,
        color: `#${app.config.COLOR}`
    })
    this.fetchData()
}

Topic.prototype.fetchData = function () {
    // NEW HOT
    const ti_id = this.papeData.id
    Promise
        .all([
            app.api.topicdtl({ ti_id, orderby: 'NEW' }),
            app.api.topicdtl({ ti_id, orderby: 'HOT' })
        ])
        .then(([ resultByNew, resultByHot ]) => {
            console.log('=>>>>>>>', resultByNew, resultByHot)
            resultByNew.list = resultByNew.list.map(v => {
                v.imageList = v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))
                v.last_reply_date = util.formatTime(v.last_reply_date)
                v.subject = util.formateText(v.subject)
                v.title = util.formateText(v.title)
                return v
            })
            resultByHot.list = resultByHot.list.map(v => {
                v.imageList = v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))
                v.last_reply_date = util.formatTime(v.last_reply_date)
                v.subject = util.formateText(v.subject)
                v.title = util.formateText(v.title)
                return v
            })
            this.setData({
                tpcinfo: resultByNew.tpcinfo,
                topUser: resultByNew.topUser,
                partinNum: resultByNew.partinNum,
                newList: resultByNew.list,
                newPage: resultByNew.page,
                newTotalNum: resultByNew.total_num,
                hotList: resultByHot.list,
                hotPage: resultByHot.page,
                hotTotalNum: resultByHot.total_num,
            })
        })
}

Topic.prototype.onReady = function () {
    var title = this.data.tpcinfo.ti_title
    // 修改导航条
    wx.setNavigationBarTitle({
        title
    })
}
Topic.prototype.changeTabs = function (e) {
    // 切换选项卡
    this.setData({
        currentIndex: e.currentTarget.dataset.index
    })
}
Topic.prototype.toUserHome = function (e) {
    wx.navigateTo({
        url: `/pages/blank/blank?type=userhome&data=${JSON.stringify({ uid: e.currentTarget.dataset.uid })}`
    })
}
Topic.prototype.clickItem = function (e) {
    app.showPost(e.currentTarget.id)
}

module.exports = Topic
