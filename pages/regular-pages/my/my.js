var app = getApp()

Page({
    data:{
        isWallet: true,
        isLogin: false,
        tabs:[],
        userInfo:{},
        setting:{}
    },
    onLoad(){
        console.log(app)
        // 判断用户是否登录
        if (app.globalData.userInfo) {
            this.setData({
                isLogin: true,
                userInfo: app.globalData.userInfo
            })
        }
        // 设置tabs
        this.setData({
            tabs: app.globalData.tabs
        })
        // 获取用户的主配置信息
        app.api.getSetting().then(res => {
            console.log(res)
            this.setData({
                setting: res.body
            })
        })
    },

    // 改变全局的moduleId
    changeModuleId(e) {
        app.to(e.currentTarget.dataset.moduleId, true)
    }
})