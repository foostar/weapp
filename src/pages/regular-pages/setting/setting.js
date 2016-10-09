var app = getApp()
Page({
    data:{
        isLogin:false,

    },
    onLoad(){
        console.log(app)
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
    switchChange(){
        console.log()
    }
})