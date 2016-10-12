
Page({
    data: {
        isUpdate: false,
        
    },
    onLoad(e) {
        
    },
    onReady(){
        wx.setNavigationBarTitle({
            title: '我的消息'
        })
    },
    // 跳转网页
    toNavigationPage(e) {
        var typePage = e.target.dataset.page
        console.log(e)
        wx.navigateTo({
            url:'/pages/regular-pages/my/topics?type='+typePage
        })
    }
})  