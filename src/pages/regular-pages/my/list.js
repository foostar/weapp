var app = getApp()

Page({
    data: {
        userId:'',
        list:'',
        title:''
    },
    onLoad(e){
        const { type } = e
        let apiType = ''
        let title = ''
        const userId = app.globalData.userInfo.uid
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
            title
        })

        app.api.getTopicList(userId, apiType)
            .then(res => {
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