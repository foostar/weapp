var app = getApp()
var { dateFormat } = require('../../../utils/util.js')

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

        app.api.getTopicList(userId, apiType)
            .then(res => {
                if(apiType == 'favorite' || apiType == 'topic' ) {
                    res.list.map((item, index) => {
                        res.list[index].last_reply_date = dateFormat(item.last_reply_date, 'yyyy-MM-dd' , false)
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