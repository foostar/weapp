/* eslint-disable */
if (typeof Object.assign != 'function') {
    Object.assign = function(target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        target = Object(target)
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

Promise = require('./lib/promise.js')

/* eslint-enable */

const mobcent = require('./lib/mobcent.js')
const Events = require('./lib/events.js')
const util = require('./utils/util.js')
const CONFIG = require('./config.js')
const DataCache = require('./lib/datacache.js')
const WeappStore = require('./lib/weappstorage.js')

const westore = new WeappStore()


const randStr = () => {
    return `a${Math.random().toString(32).split('.')[1]}`
}

const completeId = (module) => {
    module.id = randStr()
    module.componentList.forEach(completeId)
}

App({
    onLaunch() {
        console.log('onLaunch')
        // 添加监听事件
        const event = this.event = new Events()
        event.trigger('launch')
        let queue = []
        let requestNum = 0

        const fetch = (url, data, isCenter) => {
            if (!isCenter) {
                url = `${CONFIG.HOST}/client/${encodeURIComponent(url)}?appId=${CONFIG.ID}`
            } else {
                url = url.replace('https://weapp.apps.xiaoyun.com', CONFIG.HOST)
                data = data || {}
                data.body = data.body || {}
                data.headers = data.headers || {}
                data.method = data.method || 'GET'
            }
            const next = () => {
                if (queue.length) {
                    const d = queue.shift()
                    d.request().then(d.resolve, d.reject)
                } else {
                    // wx.hideToast()
                }
            }
            const request = () => (new Promise((resolve, reject) => {
                let formData
                let body
                try {
                    body = JSON.parse(data.body)
                    formData = body.formData
                } catch (err) {
                    formData = null
                }
                if (formData) {
                    return wx.uploadFile({
                        url,
                        filePath: body.filePath,
                        name: 'uploadFile[]',
                        formData: body.formData,
                        success: (response) => {
                            try {
                                response.data = JSON.parse(response.data)
                            } catch (err) {
                                return reject(err)
                            }
                            resolve(response)
                        },
                        fail: reject
                    })
                }
                wx.request({
                    url,
                    data: data.body,
                    header: data.headers,
                    method: data.method,
                    success: (result) => {
                        /* eslint-disable */
                        if (((result.statusCode / 100) | 0) !== 2) {
                            return reject(result)
                        }
                        /* eslint-enable */
                        resolve(result)
                    },
                    fail: reject
                })
            }))
            .then((result) => {
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

        const api = this.api = new mobcent.API(CONFIG.URL, {
            dataCache: new DataCache(westore),
            parse: (response) => {
                response.ok = true
                return { json: response.data, response }
            },
            fetchCenter(url, data) {
                return fetch(url, data, true).then(result => result.data)
            },
            fetch
        })

        api.appId = CONFIG.ID

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
        const { globalData } = this
        api.forum = function () {
            /* eslint-disable */
            return forum.apply(api, arguments).then((data) => {
            /* eslint-enable */
                data.list.forEach((v) => {
                    v.repliedAt = util.formatTime(v.repliedAt)
                    if (globalData.liststyle && globalData.liststyle == 'neteaseNews') {
                        v.subject = util.formateText(v.subject, 32)
                    } else {
                        v.subject = util.formateText(v.subject)
                    }
                    let faceResult = util.infoToFace(v.subject)
                    v.hasFace = faceResult.hasFace
                    v.subject = faceResult.data
                    if (v.reply.length > 0) {
                        v.reply.forEach((i) => {
                            let rfaceResult = util.infoToFace(i.text)
                            i.hasFace = rfaceResult.hasFace
                            i.text = rfaceResult.data
                        })
                    }
                })
                return data
            })
        }

        const getSystemInfo = this.getSystemInfo()

        api.forumKey = CONFIG.KEY

        const promise = this.wxLogin().then(() => Promise.all([
            api.app(),
            api.ui(),
            getSystemInfo,
            this.fetchAuthUser()
        ]).then(([ appResult, uiResult, systemInfo, wxuserInfo ]) => {
            this.globalData.wechat_userInfo = JSON.parse(wxuserInfo)
            this.globalData.systemInfo = systemInfo
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
        }))

        this.ready = () => promise

        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
            this.globalData.wxtoken = userInfo.wxtoken
            this.globalData.userInfo = userInfo
            api.token = userInfo.token
            api.secret = userInfo.secret
        }
    },
    showPost(opt) {
        wx.navigateTo({
            url: `/pages/blank/blank?type=post&data=${JSON.stringify(opt)}`
        })
    },
    showUserHome(id) {
        if (this.isLogin()) {
            wx.navigateTo({
                url: `/pages/blank/blank?type=userhome&data=${JSON.stringify({ uid: id })}`
            })
        }
    },
    // 绑定
    wxLogin() {
        const self = this
        return new Promise((resolve, reject) => {
            // 调用微信登录接口
            return wx.login({
                success(res) {
                    return self.api.initLogin(res.code)
                        .then(({ token }) => {
                            self.globalData.wxtoken = token
                            return resolve()
                        }, () => reject())
                }
            })
        })
    },

    // 验证微信用户信息
    fetchAuthUser() {
        const self = this
        return new Promise((resolve) => {
            return wx.getUserInfo({
                success({ encryptedData, iv, rawData, signature }) {
                    self.globalData.wechat_userInfo = JSON.parse(rawData)
                    self.globalData.wxchat_bind_info = { encryptedData, iv, rawData, signature }
                    return resolve(rawData)
                }
            })
        })
    },

    createForum(param) {
        if (this.isLogin()) {
            const data = JSON.stringify(param)
            wx.navigateTo({
                url: `/pages/blank/blank?type=createforum&data=${data}`
            })
        }
    },
    replyPost(param) {
        if (this.isLogin()) {
            wx.navigateTo({
                url: `/pages/blank/blank?type=createforum&data=${JSON.stringify({ fid: param.fid, actType: 'reply' })}`
            })
        }
    },
    showTopic(param) {
        const { eventKey, id, title } = param
        this.globalData.moduleData = {
            componentList: [],
            extParams: {
                forumId: id
            },
            title,
            style: 'flat',
            id: eventKey,
            type: 'topiclistComplex'
        }
        wx.navigateTo({
            url: '/pages/blank/blank'
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
    isIphone() {
        var reg = /iphone/ig
        var model = this.globalData.systemInfo.model
        return reg.test(model)
    },
    showErrorMes(opt) {
        opt = opt || {}
        wx.showToast({
            title: opt.title || '操作失败',
            duration: opt.duration || 1500
        })
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
        iconSrc: 'http://ogeqm3xfh.bkt.clouddn.com/images/app/',
        userInfo: null
    }
})
