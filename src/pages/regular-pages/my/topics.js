var app = getApp()
var { dateFormat, formatTime } = require('../../../utils/util.js')

Page({
    data: {
        userId:'',
        list:'',
        title:'',
        apiType:'',
        isUserList: false
    },
    onLoad(e){
        const { type, uid } = e
        const { userInfo } = app.globalData
        let apiType = ''
        let title = ''
        let promise  = {}
        const userId = userInfo.uid
        const isMy =  (!uid || uid == userId)
        switch(type) {
            case 'myCollection': 
                apiType = 'favorite'
                title = '我的收藏'
                break;
            case 'myFriend':
                apiType = 'friend'
                title = '我的好友'
                break;
            case 'myTopic':
                apiType = 'topic'
                title = '我的发表'
                break;
            case 'myInfo':
                apiType = 'myInfo'
                title = '我的消息'
                break;
            case 'myReply':
                apiType = 'reply'
                title = isMy ? '我的参与' : 'Ta的参与'
                break;
            case 'myFollow':
                apiType = 'follow'
                title = isMy ? '我的关注' : 'Ta的关注'
                break;
            case 'myFollowed':
                apiType = 'followed'
                title = isMy ? '我的粉丝' : 'Ta的粉丝'
                break;
            default: 
                apiType = 'favorite'
        }
        let obj = {
            userId: isMy ? userId : uid,
            title,
            apiType
        }
        if(apiType == 'friend' || apiType == 'follow' || apiType == 'followed') {
            obj.isUserList = true // 是否是用户列表
            // 好友列表
            promise = app.api.getUserList(obj.userId, apiType)
        } else {
            obj.isUserList = false // 是否是用户列表
            // 收藏帖子列表
            promise = app.api.getTopicList(obj.userId, apiType)   
        }

        promise.then(res => {
            if(apiType == 'favorite' || apiType == 'topic' || apiType == 'reply') {
                res.list.map((item, index) => {
                    res.list[index].last_reply_date = dateFormat(item.last_reply_date, 'yyyy-MM-dd' , false)
                    res.list[index].pic_path = item.pic_path.replace('xgsize_', 'mobcentSmallPreview_')
                })
            }
            if(apiType == 'friend' || apiType == 'follow' || apiType == 'followed') {
                res.list.map((item, index) => {
                    res.list[index].lastLogin = formatTime(item.lastLogin)
                })
            }
            console.log(res)
            obj.list = res.list
            this.setData(obj)
        })
        .catch(err => console.log(err))
    },
    onReady(){
        wx.setNavigationBarTitle({
            title: this.data.title
        })
    }
})