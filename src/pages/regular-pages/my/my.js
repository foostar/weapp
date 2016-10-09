var app = getApp()

Page({
    data:{
        isWallet: true,
        isLogin: false,
        tabs:[],
        userInfo:{},
        setting:{},
        modalHidden: true
    },
    onLoad(){
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
            this.setData({
                setting: res.body
            })
        })
        app.event.on('login', userInfo => {
            this.setData({
                isLogin: true,
                userInfo: userInfo
            })
        })
    },
    onReady(){
        wx.setNavigationBarTitle({
            title: '我的'
        })
    },
    // 跳转到设置页
    toSetting(){
        wx.navigateTo({
            url:'/pages/regular-pages/setting/setting'
        })
    },
    // 改变全局的moduleId
    changeModuleId(e) {
        app.to(e.currentTarget.dataset.moduleId, true)
    },
    toLogin(){
        if (!this.data.isLogin){
            wx.navigateTo({
                url:'/pages/regular-pages/login/login'
            })
        }
    },
    // 改变题提示状态
    bindChange() {
        if (this.data.isLogin){
            this.setData({
                modalHidden: !this.data.modalHidden
            })
        } else {
            wx.navigateTo({
                url:'/pages/regular-pages/login/login'
            })
        } 
    },
    // 用户登出
    logout(){
        this.setData({
            isLogin: false,
            userInfo: null,
            modalHidden: !this.data.modalHidden
        })
        app.globalData.userInfo = null
        wx.setStorageSync('userInfo', null)
    },
    // 跳转网页
    toNavigationPage(e) {
        var typePage = e.target.dataset.page
        console.log(e)
        if(this.data.isLogin) {
            wx.navigateTo({
                url:'/pages/regular-pages/my/topics?type='+typePage
            })
        } else {
            wx.navigateTo({
                url:'/pages/regular-pages/login/login'
            })
        } 
    }
})