var app = getApp()
var { dateFormat, formatTime } = require('../../../utils/util.js')

Page({
    data: {
        userId:'',
        list:'',
        title:'',
        apiType:''
    },
    onLoad(e){
        const { type } = e
        const { userInfo } = app.globalData
        let apiType = ''
        let title = ''
        let promise  = {}
        const userId = userInfo.uid
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
            default: 
                apiType = 'favorite'
        }

        this.setData({
            userId,
            title,
            apiType
        })
        if(apiType == 'friend') {
            // 好友列表
            promise = app.api.getUserList(userId, apiType)
        } else {
            // 收藏帖子列表
            promise = app.api.getTopicList(userId, apiType)   
        }

        promise.then(res => {
            if(apiType == 'favorite' || apiType == 'topic' ) {
                res.list.map((item, index) => {
                    res.list[index].last_reply_date = dateFormat(item.last_reply_date, 'yyyy-MM-dd' , false)
                    res.list[index].pic_path = item.pic_path.replace('xgsize_', 'mobcentSmallPreview_')
                })
            }
            if(apiType == 'friend') {
                res.list.map((item, index) => {
                    res.list[index].lastLogin = formatTime(item.lastLogin)
                })
            }
            console.log(res)
            this.setData({
                list: res.list
            })
        })
        .catch(err => console.log(err))
    },
    onReady(){
        wx.setNavigationBarTitle({
            title: this.data.title
        })
    }
})