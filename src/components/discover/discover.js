const Component = require('../../lib/component.js')

const app = getApp()

function Discover(key, module) {
    this.module = module
    Component.call(this, key)
    var childrenModule = {}
    module.componentList.forEach((m) => {
        // 只有当style discoverCustom 时读取自组建
        if (m.style === 'discoverCustom') {
            m.id = 'discoverCustom'
            this.addByModule(m)
            childrenModule = m
        }
    })
    // 我的 page 的 data
    this.data = {
        module: childrenModule,
        isWallet: true,
        isLogin: false,
        tabs: [],
        userInfo: {},
        setting: {},
        loadSrc: app.globalData.loadSrc,
        iconSrc: app.globalData.iconSrc,
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
    // 设置tabs 如果 tabs存在则则隐藏 我的消息
    // this.setData({
    //     tabs: app.globalData.tabs.filter((v) => v.title == '消息')
    // })
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
            url: '/pages/blank/blank?type=login'
        })
    }
}

    // 跳转到设置页
Discover.prototype.toSetting = function () {
    wx.navigateTo({
        url: '/pages/blank/blank?type=setting'
    })
}
    // 改变全局的moduleId
Discover.prototype.changeModuleId = function (e) {
    app.to(e.currentTarget.dataset.moduleId, true)
}
// 改变题提示状态
Discover.prototype.bindChange = function () {
    if (this.data.isLogin) {
        // this.logout()
        wx.showModal({
            title: '帐号管理',
            content: '是否要退出用户',
            success: res => {
                let confirm
                if (typeof res.confirm === 'string') {
                    confirm = res.confirm === 'true'
                } else {
                    confirm = Boolean(res.confirm)
                }
                if (confirm) {
                    this.logout()
                }
            },
            fail: err => {
                console.log(err)
            }

        })
    } else {
        wx.navigateTo({
            url: '/pages/blank/blank?type=login'
        })
    }
}
    // 用户登出
Discover.prototype.logout = function () {
    this.setData({
        isLogin: false,
        userInfo: null,
    })
    app.api.secret = ''
    app.api.token = ''
    app.globalData.userInfo = null
    wx.setStorageSync('userInfo', null)
    app.event.trigger('logout')
}
// 跳转网页
Discover.prototype.toNavigationPage = function (e) {
    var typePage = e.currentTarget.dataset.page
    if (this.data.isLogin) {
        if (typePage == 'myInfo') {
            return wx.navigateTo({
                url: '/pages/blank/blank?type=messagelist'
            })
        }
        wx.navigateTo({
            url: `/pages/blank/blank?type=mylistcompos&data=${JSON.stringify({ type: typePage })}`
        })
    } else {
        // 登录页面
        wx.navigateTo({
            url: '/pages/blank/blank?type=login'
        })
    }
}
    // 跳到用户主页
Discover.prototype.toUserHome = function (e) {
    wx.navigateTo({
        url: `/pages/blank/blank?type=userhome&data=${JSON.stringify({ uid: e.currentTarget.dataset.uid })}`
    })
}
module.exports = Discover
