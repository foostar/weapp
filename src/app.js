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
        this.config = CONFIG
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
                        if (result.statusCode == 200 && result.data && result.data.errcode == 50000000) return event.trigger('errormessage', '您需要先登录才能继续本操作')

                        /* eslint-disable */
                        if (((result.statusCode / 100) | 0) !== 2) {

                            if (result.data.err && result.data.err.errcode) {
                                event.trigger('errormessage', result.data.err.errcode)
                            } else {
                                if (result.data.errcode == 102 || result.data.errcode == 103 || result.data.errcode == 403 || result.data.errcode == 401) {
                                    reject(result)
                                } else {
                                    event.trigger('errormessage', result.data.msg)
                                }
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

        api.forumKey = CONFIG.KEY

        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })

        const getUserInfo = () => {
            return this.getStoragePromise('userInfo').then((userInfo) => {
                if (userInfo) {
                    return userInfo
                }
                return this.getTokenPromise().then(token => {
                    if (!token) return Promise.reject()
                    return this.getUserInfoPromise().then(({ encryptedData, iv, rawData, signature }) => {
                        this.setStoragePromise('token', token)
                        return this.api.wxLogin({ token, encryptedData, iv, rawData, signature })
                    })
                })
            })
        }

        const promise = Promise.all([
            promiseRetry(retry => api.app().catch(retry)),
            promiseRetry(retry => api.ui().catch(retry)),
            this.getSystemInfo().catch(() => Promise.resolve()),
            getUserInfo().catch(() => Promise.resolve())
        ]).then(([ appResult, uiResult, systemInfo, userInfo ]) => {
            if (userInfo && userInfo.token) {
                this.saveUserInfo(userInfo)
            }

            if (systemInfo) {
                this.globalData.systemInfo = systemInfo
            }

            // 写入APP信息
            this.globalData.info = appResult.body.data

            // 写入UI配置信息
            const modules = this.globalData.modules = {}
            this.globalData.tabs = uiResult.body.navigation.navItemList
            // 处理没有ID的module
            uiResult.body.moduleList.forEach((x) => {
                modules[x.id] = x
                x.componentList.forEach(completeId)
            })
        })

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

    getTokenPromise() {
        const getTokenFromAPI = () => promiseRetry(retry => this.loginPromise()
            .then(({ code }) => this.api.initLogin(code))
            .then(result => result.token).catch(retry))
        return this.getStoragePromise('token')
            .then(token => {
                if (!token) return getTokenFromAPI()
                return this.api.checkLogin(token)
                    .then(() => {
                        return token
                    }, () => {
                        return getTokenFromAPI()
                    })
            })
            .then((token) => {
                if (token) return token
                return getTokenFromAPI()
            })
    },
    saveUserInfo(userInfo) {
        const api = this.api
        this.globalData.userInfo = userInfo
        api.token = userInfo.token
        api.secret = userInfo.secret
        this.event.trigger('login', userInfo)
        return this.setStoragePromise('userInfo', userInfo)
    },
    clearUserInfo() {
        const api = this.api
        api.secret = ''
        api.token = ''
        this.globalData.userInfo = null
        this.event.trigger('logout')
        return Promise.all([
            this.setStoragePromise('userInfo', null),
            this.setStoragePromise('token', null)
        ])
    },


    getStoragePromise(key) {
        return new Promise(resolve => {
            wx.getStorage({
                key,
                success(result) {
                    resolve(result.data)
                },
                fail() {
                    return resolve()
                }
            })
        })
    },

    setStoragePromise(key, data) {
        return new Promise((resolve, reject) => {
            wx.setStorage({
                key,
                data,
                success: resolve,
                fail: reject
            })
        })
    },

    loginPromise() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: resolve,
                fail: reject
            })
        })
    },

    getUserInfoPromise() {
        return new Promise((resolve, reject) => {
            return wx.getUserInfo({
                success: resolve,
                fail: reject
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
    isIphone() {
        var reg = /iphone/ig
        var model = this.globalData.systemInfo.model
        return reg.test(model)
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
