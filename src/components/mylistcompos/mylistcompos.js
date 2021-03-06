const ListComponent = require('../../lib/listcomponent.js')
const { dateFormat, formatTime, formateText } = require('../../utils/util.js')

const app = getApp()

function switchType(type, isMy) {
    var result = {}
    switch (type) {
        case 'myCollection':
            result.apiType = 'favorite'
            result.title = '我的收藏'
            result.defaulticon = 'no_collection.png'
            result.defaultdesc = [
                '暂无收藏',
                '好东西，要收藏哦～'
            ]
            break
        case 'myFriend':
            result.apiType = 'friend'
            result.title = '我的好友'
            result.defaulticon = 'no_friend.png'
            result.defaultdesc = [
                '加好友，看小伙伴们的日常！'
            ]
            break
        case 'myTopic':
            result.apiType = 'topic'
            result.title = '我的发表'
            result.defaulticon = 'no_post.png'
            result.defaultdesc = [
                '添内容，喂饱我O(∩_∩)O'
            ]
            break
        case 'myReply':
            result.apiType = 'reply'
            result.title = isMy ? '我的参与' : 'Ta的参与'
            result.defaulticon = 'no_reply.png'
            result.defaultdesc = [
                '暂无相关内容',
                '快醒醒，起来嗨!'
            ]
            break
        case 'myFollow':
            result.apiType = 'follow'
            result.title = isMy ? '我的关注' : 'Ta的关注'
            result.defaulticon = 'no_follow.png'
            result.defaultdesc = [
                '世界怎么大，等你去看看！',
            ]
            break
        case 'myFollowed':
            result.apiType = 'followed'
            result.title = isMy ? '我的粉丝' : 'Ta的粉丝'
            result.defaulticon = 'no_fans.png'
            result.defaultdesc = [
                '暂无粉丝',
                '为内容，圈粉丝'
            ]
            break
        case 'recommend':
            result.apiType = 'recommend'
            result.title = '推荐用户'
            result.defaulticon = 'no_follow.png'
            result.defaultdesc = [
                '世界怎么大，等你去看看！',
            ]
            break
        default:
            result.apiType = 'favorite'
    }
    return result
}

function Mylistcompos(key, module) {
    if (module.data) {
        this.papeData = module.data
    }

    ListComponent.call(this, key)
    this.data = {
        iconSrc: app.globalData.iconSrc,
        userId: '',
        list: [],
        title: '',
        apiType: '',
        page: 0,
        recommendPage: 0,
        isUserList: false,
        isNotify: false,
        isControl: true
    }
}
Mylistcompos.prototype = Object.create(ListComponent.prototype)
Mylistcompos.prototype.name = 'mylistcompos'
Mylistcompos.prototype.constructor = Mylistcompos
Mylistcompos.prototype.onReady = function () {
    wx.setNavigationBarTitle({
        title: this.data.title
    })
}
Mylistcompos.prototype.onLoad = function () {
    this.nextPage()
}
// 加载下一页
Mylistcompos.prototype.nextPage = function () {
    let { list, page } = this.data
    const { type, uid } = this.papeData
    const { userInfo } = app.globalData
    let promise = {}
    const userId = userInfo.uid
    const isMy = (!uid || uid == userId)
    const switchtype = switchType(type, isMy)
    let obj = Object.assign({
        userId: isMy ? userId : uid,
        isNotify: false,
        isControl: uid == app.globalData.userInfo.uid,
        page: page += 1,
        isMy
    }, switchtype)

    let { apiType } = obj
    let options = {
        page
    }

    if (apiType === 'friend' || apiType === 'follow' || apiType === 'followed' || apiType === 'recommend') {
        obj.isUserList = true // 是否是用户列表
        // 好友列表
        promise = app.api.getUserList(obj.userId, apiType, options)
    } else {
        obj.isUserList = false // 是否是用户列表
        // 收藏帖子列表
        promise = app.api.getTopicList(obj.userId, apiType, options)
    }

    promise.then(res => {
        if (apiType === 'favorite' || apiType === 'topic' || apiType === 'reply') {
            res.list.forEach(item => {
                item.repliedAt = dateFormat(item.last_reply_date, 'yyyy-MM-dd', false)
                item.pic_path = item.pic_path.replace('xgsize_', 'mobcentSmallPreview_')
                item.subject = formateText(item.subject)
                /* eslint-disable */
                item.images = item.imageList && item.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_')) || new Array(item.pic_path) || []
                /* eslint-enable */
                item.user = {
                    id: item.user_id,
                    nickname: item.user_nick_name,
                    avatar: item.userAvatar,
                    title: item.userTitle
                }
                item.views = item.hits
            })
        }

        if (apiType === 'friend' || apiType === 'follow' || apiType === 'followed' || apiType === 'recommend') {
            res.list.forEach(item => {
                item.lastLogin = formatTime(item.lastLogin)
                item.dateline = dateFormat(item.dateline, 'yyyy-MM-dd', false)
            })
        }

        obj.list = list.concat(res.list)
        this.setData(obj)
    })
    .catch(err => {
        console.log(err)
    })
}

Mylistcompos.prototype.showPost = function (e) {
    const postid = e.currentTarget.dataset.postid
    app.showPost({ type: 'post', id: postid })
}

Mylistcompos.prototype.toUserhome = function (e) {
    const uid = e.currentTarget.dataset.uid
    app.showUserHome(uid)
}

Mylistcompos.prototype.foucsUser = function (e) {
    let index = e.currentTarget.dataset.index
    const { userId } = this.data
    if (!app.isLogin()) return
    let type = 'follow'
    let result = 1
    let self = this
    if (e.currentTarget.dataset.focus != 0) {
        type = 'unfollow'
        result = 0
    }
    app.api.useradmin({ uid: e.currentTarget.dataset.uid, type, userId })
        .then((data) => {
            wx.showToast({
                title: data.errcode
            })
            self.data.list[index].isFollow = result
            self.setData(self.data)
        })
}

module.exports = Mylistcompos
