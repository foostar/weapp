const Component = require('../../lib/component')
const { dateFormat, formatTime } = require('../../utils/util.js')

const app = getApp()

function Mylistcompos(key, module) {
    if (module.data) {
        this.papeData = module.data
    }
    Component.call(this, key)
    this.data = {
        userId: '',
        list: '',
        title: '',
        apiType: '',
        isUserList: false,
        isNotify: false
    }
}
Mylistcompos.prototype = Object.create(Component.prototype)
Mylistcompos.prototype.name = 'mylistcompos'
Mylistcompos.prototype.constructor = Mylistcompos
Mylistcompos.prototype.onReady = function () {
    wx.setNavigationBarTitle({
        title: this.data.title
    })
}
Mylistcompos.prototype.onLoad = function () {
    const { type, uid } = this.papeData
    const { userInfo } = app.globalData
    let apiType = ''
    let title = ''
    let isNotify = false
    let promise = {}
    const userId = userInfo.uid
    const isMy = (!uid || uid == userId)
    switch (type) {
        case 'myCollection':
            apiType = 'favorite'
            title = '我的收藏'
            break
        case 'myFriend':
            apiType = 'friend'
            title = '我的好友'
            break
        case 'myTopic':
            apiType = 'topic'
            title = '我的发表'
            break
        case 'myInfo':
            apiType = 'myInfo'
            title = '我的消息'
            break
        case 'myReply':
            apiType = 'reply'
            title = isMy ? '我的参与' : 'Ta的参与'
            break
        case 'myFollow':
            apiType = 'follow'
            title = isMy ? '我的关注' : 'Ta的关注'
            break
        case 'myFollowed':
            apiType = 'followed'
            title = isMy ? '我的粉丝' : 'Ta的粉丝'
            break
        case 'at':
            apiType = 'at'
            title = '提到我的'
            isNotify = true
            break
        case 'friend':
            apiType = 'friend'
            title = '提到我的'
            isNotify = true
            break
        case 'post':
            apiType = 'post'
            title = '评论'
            isNotify = true
            break
        default:
            apiType = 'favorite'
    }
    let obj = {
        userId: isMy ? userId : uid,
        title,
        apiType,
        isNotify
    }

    if (obj.isNotify) {
        // 是否是我的消息
        promise = app.api.getNotifyList(obj.apiType)
        console.log('是否是我的消息')
    } else if (apiType === 'friend' || apiType === 'follow' || apiType === 'followed') {
        obj.isUserList = true // 是否是用户列表
        // 好友列表
        promise = app.api.getUserList(obj.userId, apiType)
    } else {
        obj.isUserList = false // 是否是用户列表
        // 收藏帖子列表
        promise = app.api.getTopicList(obj.userId, apiType)
    }

    promise.then(res => {
        if (apiType === 'favorite' || apiType === 'topic' || apiType === 'reply') {
            res.list.map((item, index) => {
                res.list[index].last_reply_date = dateFormat(item.last_reply_date, 'yyyy-MM-dd', false)
                res.list[index].pic_path = item.pic_path.replace('xgsize_', 'mobcentSmallPreview_')
                return res
            })
        }
        if (apiType === 'friend' || apiType === 'follow' || apiType === 'followed') {
            res.list.map((item, index) => {
                res.list[index].lastLogin = formatTime(item.lastLogin)
                return res
            })
        }
        obj.list = res.list
        this.setData(obj)
    })
    .catch(err => console.log(err))
}


module.exports = Mylistcompos
