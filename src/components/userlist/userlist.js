const ListComponent = require('../../lib/listcomponent.js')
const { formatTime } = require('../../utils/util.js')

const app = getApp()
function UserList(key, module) {
    this.module = module
    ListComponent.call(this, key)
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
UserList.prototype.nextPage = function () {
    const { filter: type, orderby } = this.module.extParams
    let { list, page } = this.data
    app.api.getUserList(this.uid, type, {
        page,
        orderBy: orderby
    }).then((data) => {
        data.list.map((item, index) => {
            data.list[index].lastLogin = formatTime(item.lastLogin)
            return data
        })
        list = list.concat(data.list)
        this.setData({ list, page: page += 1 })
    })
}
// 跳转到用户主页
UserList.prototype.toUserhome = function (e) {
    wx.navigateTo({
        url: `/pages/blank/blank?type=userhome&data=${JSON.stringify({ uid: e.currentTarget.dataset.uid })}`
    })
}


module.exports = UserList

