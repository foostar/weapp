const ListComponent = require('../../lib/listcomponent.js')
const { formatTime, dateFormat } = require('../../utils/util.js')

const app = getApp()
function FollowList(key, module) {
    this.module = module
    ListComponent.call(this, key)
    this.data = {
        iconSrc: app.globalData.iconSrc,
        list: [],
        recommendList: [],
        page: 1
    }
}
FollowList.prototype = Object.create(ListComponent.prototype)
FollowList.prototype.name = 'followlist'
FollowList.prototype.constructor = FollowList
// 检测登陆
FollowList.prototype.onLoad = function () {
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
FollowList.prototype.nextPage = function () {
    const { orderby } = this.module.extParams
    let { list, page } = this.data
    app.api.followList({
        page,
        orderBy: orderby
    }).then(data => {
        console.log(data)
        data.list.map((item, index) => {
            data.list[index].lastLogin = formatTime(item.lastLogin)
            return data
        })
        list = list.concat(data.list)
        list = []
        if (list.length === 0) {
            return this.getRecommendList().then(res => {
                this.setData({
                    recommendList: res
                })
            })
        }
        this.setData({ list, page: page += 1 })
    })
}
// 获取推荐好友
FollowList.prototype.getRecommendList = function () {
    var opts = { page: 1, pageSize: 7 }
    return app.api.getUserList(this.uid, 'recommend', opts)
        .then(result => {
            result.list.map((item, index) => {
                result.list[index].lastLogin = dateFormat(item.lastLogin, 'yyyy-MM-dd', false)
                return result
            })
            console.log(result.list)
            return Promise.resolve(result.list)
        }, err => console.log('err', err))
}


module.exports = FollowList
