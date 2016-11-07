var app = getApp()
Page({
    data:{
        isLogin:false,
    },
    onLoad(){
        if(app.globalData.userInfo){
            this.setData({
                isLogin:true
            })
        }
    },
    onReady(){
        wx.setNavigationBarTitle({
            title: '设置'
        })
    },
    onShow(){
        wx.setNavigationBarTitle({
            title: '设置'
        })
    },
    switchChange(){
        console.log()
    },
    // 跳转网页
    toNavigationPage(e) {
        var typePage = e.currentTarget.dataset.page
        console.log(typePage)
        wx.navigateTo({
            url: `/pages/blank/blank?type=${typePage}`
        })
    },

})