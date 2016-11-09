/* eslint-disable */
if (typeof Object.assign != 'function') {
    Object.assign = function(target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}
/* eslint-enable */

const mobcent = require('./lib/mobcent.js')
const Events = require('./lib/events.js')
const util = require('./utils/util')
const CONFIG = require('./config.js')

const randStr = () => {
    return `a${Math.random().toString(32).split('.')[1]}`
}

const completeId = (module) => {
    module.id = randStr()
    module.componentList.forEach(completeId)
}

App({
    onLaunch() {
        // 添加监听事件
        const event = this.event = new Events()
        event.trigger('launch')

        let queue = []
        let requestNum = 0
        const api = this.api = new mobcent.API(CONFIG.URL, {
            parse: (response) => {
                response.ok = true
                return { json: response.data, response }
            },
            fetch: (url, data) => {
                url = `https://weapp.apps.xiaoyun.com/client/${encodeURIComponent(url)}`
                const next = () => {
                    if (queue.length) {
                        const d = queue.shift()
                        d.request().then(d.resolve, d.reject)
                    } else {
                        // wx.hideToast()
                    }
                }
                const request = () => (new Promise((resolve, reject) => {
                    wx.request({
                        url,
                        data: data.body,
                        header: data.headers,
                        method: data.method,
                        success: resolve,
                        error: reject
                    })
                })).then((result) => {
                    requestNum -= 1
                    next()
                    return result
                }, (err) => {
                    requestNum -= 1
                    next()
                    return Promise.reject(err)
                })
                requestNum += 1
                if (requestNum >= 6) {
                    return new Promise((resolve, reject) => {
                        queue.push({
                            request,
                            resolve,
                            reject
                        })
                    })
                }
                // wx.showToast({
                //     title: '加载中',
                //     icon: 'loading',
                //     duration: 10000
                // })
                const promise = request()
                return promise
            }
        })

        // 处理自定义页面的ID问题
        const custom = api.custom
        api.custom = function () {
            /* eslint-disable */
            return custom.apply(api, arguments).then((data) => {
            /* eslint-enable */
                data.body.module.componentList.forEach(completeId)
                return data
            })
        }

        // 处理forum数据
        const forum = api.forum
        api.forum = function () {
            /* eslint-disable */
            return forum.apply(api, arguments).then((data) => {
            /* eslint-enable */
                data.list.forEach((v) => {
                    v.imageList = v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))
                    v.last_reply_date = util.formatTime(v.last_reply_date)
                    v.subject = util.formateText(v.subject)
                })
                return data
            })
        }


        api.forumKey = CONFIG.KEY
        const promise = Promise.all([
            api.app(),
            api.ui()
        ]).then(([ appResult, uiResult ]) => {
            this.globalData.info = appResult.body.data
            const modules = this.globalData.modules = {}
            this.globalData.tabs = uiResult.body.navigation.navItemList
            // 处理没有ID的module
            uiResult.body.moduleList.forEach((x) => {
                modules[x.id] = x
                x.componentList.forEach(completeId)
            })
            this.config = CONFIG
            return this.globalData
        }, (err) => {
            console.log('error', err)
        })
        this.ready = () => promise
        // 微信登录
        // this.getUserInfo((res) => {
        //     console.log(res)
        // })
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.globalData.userInfo = userInfo
            api.token = userInfo.token
            api.secret = userInfo.secret
        }
    },
    showPost(id) {
        this.globalData.postId = id
        wx.navigateTo({
            url: '/pages/blank/blank?type=post'
        })
    },
    getUserInfo(cb) {
        const that = this
        if (this.globalData.userInfo) {
            typeof cb === 'function' && cb(this.globalData.userInfo)
        } else {
            // 调用登录接口
            wx.login({
                success() {
                    wx.getUserInfo({
                        success(res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb === 'function' && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    createForum(param) {
        const data = JSON.stringify(param)
        wx.navigateTo({
            url: `/pages/blank/blank?type=createforum&data=${data}`
        })
    },
    getSystemInfo() {
        return new Promise((resolve) => {
            wx.getSystemInfo({
                success(res) {
                    resolve(res)
                }
            })
        })
    },
    isIphone(model) {
        var reg = /iphone/ig
        return reg.test(model)
    },
    isLogin() {
        if (!this.globalData.userInfo || !this.globalData.userInfo.uid) {
            return wx.navigateTo({
                url: '/pages/blank/blank?type=login'
            })
        }
        return true
    },
    globalData: {
        loadSrc: '/images/dz_icon_article_default.png',
        userInfo: null
    }
})
