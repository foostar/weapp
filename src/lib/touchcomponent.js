const Component = require('./component.js')
const { needLogin } = require('../utils/util.js')

const app = getApp()
const fns = {
    touch(e) {
        const currentIndex = e.currentTarget.dataset.index || 0
        let info = this.module.componentList[currentIndex]
        app.globalData.moduleData = info

        if (info.type == 'newsview') {
            return app.showPost({ type: 'article', id: info.extParams.articleId })
        }
        if (info.type == 'postlist') {
            return app.showPost({ type: 'post', id: info.extParams.topicId })
        }
        if (!app.globalData.userInfo &&
            (needLogin(info.type) ||
            (info.type == 'moduleRef' &&
            needLogin(app.globalData.modules[info.extParams.moduleId].type)))) {
            return wx.navigateTo({
                url: '/pages/blank/blank?type=login'
            })
        }
        /*
            'empty' // 无
            'moduleRef' // 选择页面
            'forumlist' // 社区版块列表
            'newslist' // 高级内容列表
            'topiclistSimple' // 帖子列表
            'topiclistComplex' // 复杂帖子列表
            'postlist' // 帖子详情
            'newsview' // 文章详情
            'webapp' // 外部URL
            'plugin' // 插件
            'mall' // 微商城
            'userinfo' // 用户中心
            'userlist' // 用户列表
            'messagelist' // 消息列表
            'setting' // 设置
            'search' // 搜索
            'fasttext' // 发表文字
            'fastimage' // 发表图片
            'fastcamera' // 发表拍照
            'fastaudio' // 发表语音
            'sign' // 签到
            'scan' // 二维码扫描
            'newlivelist' // 直播间
            'configSwitch' // 配置切换
            'talk' // 话题列表
            'talkPostList' // 话题帖子列表
         */

        if (info.type == 'sign') {
            app.api.sign().then(success => {
                app.event.trigger('errormessage', success.errcode)
            }, err => {
                if (err.errcode == 50000000) {
                    app.event.trigger('errormessage', '您需要先登录才能继续本操作')
                } else {
                    app.event.trigger('errormessage', err.errcode)
                }
            })
            return
        }
        if (info.type !== 'empty') {
            wx.navigateTo({
                url: `/pages/blank/blank?type=${info.type}&data=${encodeURIComponent(JSON.stringify(info))}`
            })
        }
    }
}

function TouchComponent(key, module) {
    Component.call(this, key)
    this.module = module
    Object.keys(fns).forEach((name) => {
        this.constructor.prototype[name] = fns[name]
    })
}

TouchComponent.prototype = Object.create(Component.prototype)
TouchComponent.prototype.constructor = TouchComponent


module.exports = TouchComponent
