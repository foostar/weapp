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
        page: 1,
        isLoading: false,
        over: false,
        number: 20
    }
}
FollowList.prototype = Object.create(ListComponent.prototype)
FollowList.prototype.name = 'followlist'
FollowList.prototype.constructor = FollowList
// 请求数据
FollowList.prototype.nextPage = function () {
    const { orderby } = this.module.extParams
    let { list, page, number } = this.data
    if (this.data.over) return Promise.reject()
    this.setData({
        isLoading: true,
    })
    return app.api.followList({
        page,
        orderBy: orderby,
        pageSize: number
    }).then(data => {
        data.list.map((item, index) => {
            data.list[index].repliedAt = formatTime(item.repliedAt)
            return data
        })

        list = list.concat(data.list)
        if (list.length === 0) {
            return this.getRecommendList().then(res => {
                this.setData({
                    recommendList: res
                })
            })
        }
        this.setData({
            list,
            isLoading: false,
            page: page + 1,
            over: page >= parseInt((data.meta.total / number) + 1, 10)
        })
    })
    .catch(e => console.log(e))
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
            return Promise.resolve(result.list)
        }, err => console.log('err', err))
}
// 关注用户
FollowList.prototype.followed = function (e) {
    let { uid, index } = e.currentTarget.dataset
    if (!app.isLogin()) return
    let type = 'follow'
    let result = 1
    let self = this
    if (e.currentTarget.dataset.follow != 0) {
        type = 'unfollow'
        result = 0
    }
    app.api.useradmin({ uid, type })
        .then((data) => {
            wx.showToast({
                title: data.errcode
            })
            self.data.recommendList[index].isFollow = result
            self.setData(self.data)
        })
}
FollowList.prototype.moreuser = function () {
    wx.navigateTo({
        url: `/pages/blank/blank?type=mylistcompos&data=${JSON.stringify({ type: 'recommend' })}`
    })
}


module.exports = FollowList
