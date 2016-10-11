var app = getApp()
Page({
    data: {
        isLogin: false,
        userInfo: {},
        tabs: [],
        active: 0,
        color: '#000',
        module: {},
        resources: {}
    },
    onLoad() {
        // 判断用户是否登录
        if (app.globalData.userInfo) {
            this.setData({
                isLogin: true,
                userInfo: app.globalData.userInfo
            })
        }
        const module = app.getModule()
        app.getResources(module).then((resources) => {
            console.log("resources", resources, module)
            this.setData({
                resources,
                color: app.globalData.info.appColor,
                module
            })
        })
        // 设置tabs
        this.setData({
            tabs: app.globalData.tabs
        })
    },
    onReady() {
        wx.setNavigationBarTitle({
            title: '社区'
        })
    },
    // 改变全局的moduleId
    changeModuleId(e) {
        app.to(e.currentTarget.dataset.moduleId, true)
    },
})
