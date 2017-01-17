const ListComponent = require('../../lib/listcomponent.js')
const { formatTime } = require('../../utils/util.js')

const app = getApp()
function UserList(key, module) {
    this.module = module
    ListComponent.call(this, key)
    this.orderby = this.module.extParams.orderby
    this.data = {
        list: [],
        page: 0
    }
}
UserList.prototype = Object.create(ListComponent.prototype)
UserList.prototype.name = 'userlist'
UserList.prototype.constructor = UserList
// 检测登陆
UserList.prototype.onLoad = function () {
    // 判断用户是否登陆
    if (app.globalData.userInfo && app.globalData.userInfo.uid) {
        this.uid = app.globalData.userInfo.uid
        this.nextPage()
    } else {
        wx.navigateTo({
            url: '/pages/blank/blank?type=login'
        })
    }
}
// 请求数据
UserList.prototype.fetchData = function (info) {
    const { filter: type } = this.module.extParams
    return app.api.getUserList(this.uid, type, info)
        .then(data => {
            data.list.forEach(item => {
                item.lastLogin = formatTime(item.lastLogin)
            })
            return data.list
        })
}
// 跳转到用户主页
UserList.prototype.toUserhome = function (e) {
    wx.navigateTo({
        url: `/pages/blank/blank?type=userhome&data=${JSON.stringify({ uid: e.currentTarget.dataset.uid })}`
    })
}

// 关注用户
UserList.prototype.foucsUser = function (e) {
    let index = e.currentTarget.dataset.index
    if (!app.isLogin()) return
    let type = 'follow'
    let result = 1
    let self = this
    if (e.currentTarget.dataset.focus != 0) {
        type = 'unfollow'
        result = 0
    }
    app.api.useradmin({ uid: e.currentTarget.dataset.uid, type, userId: app.globalData.userInfo.uid })
        .then((data) => {
            wx.showToast({
                title: data.errcode
            })
            self.data.list[index].isFollow = result
            self.setData(self.data)
        })
}


module.exports = UserList

