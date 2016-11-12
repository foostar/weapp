const Component = require('../../lib/component')
const { formatTime, formateText } = require('../../utils/util.js')

const app = getApp()
function UserHome(key, module) {
    if (module.data) {
        this.papeData = module.data
    }
    Component.call(this, key)
    this.data = {
        isLogin: false,
        uid: '',
        color: `#${app.config.COLOR}`,
        currentIndex: 0,
        tabs: [ '发表', '资料' ],
        info: {},
        topics: {},
        isLoading: true
    }
}
UserHome.prototype = Object.create(Component.prototype)
UserHome.prototype.name = 'userhome'
UserHome.prototype.constructor = UserHome

UserHome.prototype.onLoad = function () {
    var obj = {}
    // 判断用户是否登录
    if (app.globalData.userInfo) {
        obj.isLogin = true
    }
    obj.uid = this.papeData.uid
    obj.color = `#${app.config.COLOR}`

    this.setData(obj)
    this.fetchData()

    app.event.on('login', () => {
        this.setData({
            isLogin: true
        })
    })
}


UserHome.prototype.changeTabs = function (e) {
    // 切换选项卡
    this.setData({
        currentIndex: e.currentTarget.dataset.index
    })
}

UserHome.prototype.fetchData = function () {
    var uid = this.data.uid
    Promise
        .all([
            app.api.user(uid),
            app.api.getTopicList(uid, 'topic')
        ])
        .then(([ info, topics ]) => {
            topics.list = topics.list.map(v => {
                v.pic_path = v.pic_path.replace('xgsize_', 'mobcentSmallPreview_')
                v.last_reply_date = formatTime(v.last_reply_date)
                v.subject = formateText(v.subject)
                v.title = formateText(v.title)
                return v
            })
            this.setData({
                info,
                topics,
                tabs: [ `发表(${topics.total_num})`, '资料' ],
                isLoading: false
            })
        })
}
// 跳转网页
UserHome.prototype.toNavigationPage = function (e) {
    var typePage = e.target.dataset.page
    var uid = this.data.uid
    if (this.data.isLogin) {
        wx.navigateTo({
            url: `/pages/blank/blank?type=mylistcompos&data=${JSON.stringify({ type: typePage, uid })}`
        })
    } else {
        wx.navigateTo({
            url: '/pages/blank/blank?type=login'
        })
    }
}

UserHome.prototype.showPost = function (e) {
    console.log(e)
    app.showPost(e.currentTarget.dataset.postid)
}

module.exports = UserHome
