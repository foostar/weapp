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
const promiseRetry = require('./lib/promise_retry')

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
                        success: response => {
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
                            if(result.data.err && result.data.err.errcode) {
                                event.trigger('errormessage', result.data.err.errcode)
                            } else {
                                console.log("error", result)
                                if (result.data.errcode == 102 || result.data.errcode == 103) 
                                    return reject(result)
                                event.trigger('errormessage', result.data.msg)
                            }

                            return reject(result)
                        }
                        /* eslint-enable */
                        resolve(result)
                    },
                    fail: (result) => {
                        return reject(result)
                    }
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

        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        const promise = this
            .getWXCachefile().catch(() => Promise.resolve())
            .then(() => this.wxLogin().catch(() => Promise.resolve()))
            .then(() => Promise.all([
                promiseRetry((retry, number) => {
                    console.log('try app', number)
                    return api.app().catch(retry)
                }),
                promiseRetry((retry, number) => {
                    console.log('try ui', number)
                    return api.ui().catch(retry)
                }).catch(() => Promise.resolve()),

                getSystemInfo.catch(() => Promise.resolve()),
                this.fetchAuthUser().catch(() => Promise.resolve())
            ]).then(([ appResult, uiResult, systemInfo, wxuserInfo ]) => {
                if (wxuserInfo) {
                    this.globalData.wechat_userInfo = JSON.parse(wxuserInfo)
                }

                if (systemInfo) {
                    this.globalData.systemInfo = systemInfo
                }

                if (appResult) {
                    this.globalData.info = appResult.body.data
                } else {
                    // TODO: tishi
                }

                if (uiResult) {
                    const modules = this.globalData.modules = {}
                    this.globalData.tabs = uiResult.body.navigation.navItemList
                    // 处理没有ID的module
                    uiResult.body.moduleList.forEach((x) => {
                        modules[x.id] = x
                        x.componentList.forEach(completeId)
                    })
                }

                if (this.globalData.wxtoken) {
                    this.wechartUserLogin()
                }

                this.config = CONFIG
                return this.globalData
            }, (err) => {
                wx.hideToast()
                console.log(err)
                // TODO: 用户提示
                wx.showModal({
                    title: '提示',
                    content: err.errMsg
                })
            }))
        this.ready = () => {
            wx.hideToast()
            return promise
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

    getWXCachefile() {
        return new Promise(resolve => {
            const userInfo = wx.getStorageSync('userInfo')
            if (userInfo) {
                this.globalData.wxtoken = userInfo.wxtoken
                this.globalData.userInfo = userInfo
                this.api.token = userInfo.token
                this.api.secret = userInfo.secret
            }
            return resolve()
        })
    },

    // 绑定
    wxLogin() {
        const self = this
        return new Promise((resolve, reject) => {
            const rollback = () => wx.login({
                success(res) {
                    return self.api.initLogin(res.code)
                        .then(({ token }) => {
                            self.globalData.wxtoken = token
                            return resolve()
                        }, reject)
                },
                fail() {
                    reject()
                }
            })
            if (!this.globalData.wxtoken) {
                return rollback()
            }
            return this.api.checkLogin(this.globalData.wxtoken)
                .then(() => resolve(), rollback)
        })
    },

    // 微信直接登陆
    wechartUserLogin() {
        const wxtoken = this.globalData.wxtoken
        this.api.wxLogin(Object.assign({}, { token: wxtoken }, this.globalData.wxchat_bind_info))
            .then(res => {
                if (!res.errcode) {
                    this.globalData.userInfo = res
                    this.api.token = res.token
                    this.api.secret = res.secret
                    this.event.trigger('login', res)
                    Object.assign(res, { wxtoken })
                    try {
                        wx.setStorageSync('userInfo', res)
                    } catch (err) {
                        console.log(err)
                    }
                }
            }, err => console.log('err', err))
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
    topic(param) {
        wx.navigateTo({
            url: `/pages/blank/blank?type=topic&data=${JSON.stringify(param)}`
        })
    },
    showTopic(param) {
        const { eventKey, id, title } = param
        wx.navigateTo({
            url: `/pages/blank/blank?type=topiclistComplex&data=${JSON.stringify({
                extParams: {
                    forumId: id
                },
                title,
                id: eventKey
            })}`
        })
    },
    getSystemInfo() {
        return new Promise((resolve, reject) => {
            wx.getSystemInfo({
                success(res) {
                    resolve(res)
                },
                fail: reject
            })
        })
    },
    // isIphone() {
    //     var reg = /iphone/ig
    //     var model = this.globalData.systemInfo.model
    //     return reg.test(model)
    // },
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
    login(data) {
        if (data.errcode == 50000000) {
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
