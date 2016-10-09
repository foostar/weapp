var app = getApp()

Page({
    data: {
        isLogin: false,
        tabs:[],
        userInfo: {},
        topic: {},
        mytopic: {},
        color: '#000'
    },
    // 改变全局的moduleId
    changeModuleId: function (e) {
        app.to(e.currentTarget.dataset.moduleId, true)
    },
    featchData: function () {
        var querys = [ app.api.topic() ];
        if (this.data.isLogin) {
            querys.push(app.api.mytopic())
        }
        Promise
            .all(querys)
            .then(result => {
                console.log(result)
                this.setData({
                    topic: result[0],
                    mytopic: (result.length > 1 ? result[1] : {})
                })
            })
    },
    onLoad: function () {
        console.log(app.globalData)
        // 设置tabs 和 color
        this.setData({
            tabs: app.globalData.tabs,
            color: app.globalData.info.appColor
        })
        // 判断用户是否登录
        if (app.globalData.userInfo) {
            this.setData({
                isLogin: true,
                userInfo: app.globalData.userInfo
            })
        }
        // 监听用户是否登录
        app.event.on('login', userInfo => {
            this.setData({
                isLogin: true,
                userInfo: userInfo
            })
        })
        // 获取数据
        this.featchData()
    },
    onReady: function () {
        var title = app.globalData.modules[app.globalData.moduleId].componentList[0].title
        // 修改导航条
        wx.setNavigationBarTitle({
            title: title
        })
    },
    toLogin: function () {
        if (!this.data.isLogin){
            wx.navigateTo({
                url:'/pages/regular-pages/login/login'
            })
        }
    },
    toFollow: function () {
        console.log('toFollow')
        // app.api.caretpcByTopic

    }
})
