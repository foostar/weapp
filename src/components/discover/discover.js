const Component = require('../../lib/component')
const components = require('../../lib/components')

const app = getApp()

function Discover(key, module) {
    Component.call(this, key)
    var childrenModule = {}
    module.componentList.forEach((m) => {

        // 只有当style discoverCustom 时读取自组建
        if (m.style === 'discoverCustom') {
            m.id = 'discoverCustom'
            this.add(components.create(m))
            childrenModule = m
        }
    })
    // 我的 page 的 data
    this.data = {
        module: childrenModule,
        components: components.template,
        isWallet: true,
        isLogin: false,
        tabs: [],
        userInfo: {},
        setting: {},
        modalHidden: true
    }
}

Discover.prototype = Object.create(Component.prototype)
Discover.prototype.name = 'discover'
Discover.prototype.constructor = Discover

Discover.prototype.onLoad = function () {
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
            userInfo
        })
    })
    wx.setNavigationBarTitle({
        title: '我的'
    })
}
Discover.prototype.toLogin = function () {
    if (!this.data.isLogin) {
        wx.navigateTo({
            url: '/pages/regular-pages/login/login'
        })
    }
}


    // 跳转到设置页
Discover.prototype.toSetting = function () {
    wx.navigateTo({
        url: '/pages/regular-pages/setting/setting'
    })
}
    // 改变全局的moduleId
Discover.prototype.changeModuleId = function (e) {
    app.to(e.currentTarget.dataset.moduleId, true)
}
    // 改变题提示状态
Discover.prototype.bindChange = function () {
    if (this.data.isLogin) {
        this.setData({
            modalHidden: !this.data.modalHidden
        })
    } else {
        wx.navigateTo({
            url: '/pages/regular-pages/login/login'
        })
    }
}
    // 用户登出
Discover.prototype.logout = function () {
    this.setData({
        isLogin: false,
        userInfo: null,
        modalHidden: !this.data.modalHidden
    })
    app.api.secret = ''
    app.api.token = ''
    app.globalData.userInfo = null
    wx.setStorageSync('userInfo', null)
    app.event.trigger('logout')
}
// 跳转网页
Discover.prototype.toNavigationPage = function (e) {
    var typePage = e.target.dataset.page
    console.log(e)
    if (this.data.isLogin) {
        wx.navigateTo({
            url: `/pages/regular-pages/my/topics?type=${typePage}`
        })
    } else {
        wx.navigateTo({
            url: '/pages/regular-pages/login/login'
        })
    }
}
    // 跳到用户主页
Discover.prototype.toUserHome = function (e) {
    wx.navigateTo({
        url: `/pages/regular-pages/user-home/user-home?uid=${e.currentTarget.dataset.uid}`
    })
}
module.exports = Discover
