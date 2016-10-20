const mobcent = require('./lib/mobcent.js')
const Events = require('./lib/events.js')
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
        const api = this.api = new mobcent.API(CONFIG.FORUM_URL, {
            parse: (response) => {
                response.ok = true
                return { json: response.data, response }
            },
            fetch: (url, data) => {
                // console.log(url, data)
                const request = () => new Promise((resolve, reject) => {
                    wx.request({
                        url,
                        data: data.body,
                        header: data.headers,
                        method: data.method,
                        success: resolve,
                        error: reject
                    })
                }).then((result) => {
                    requestNum -= 1
                    return result
                }, (err) => {
                    requestNum -= 1
                    return Promise.reject(err)
                })
                requestNum += 1
                console.log(requestNum, queue)
                if (requestNum >= 5) {
                    return new Promise((resolve, reject) => {
                        queue.push({
                            request,
                            resolve,
                            reject
                        })
                    })
                }
                const promise = request()
                promise.then(() => {
                    if (queue.length) {
                        const d = queue.shift()
                        d.request().then(d.resolve, d.reject)
                    }
                }, (err) => {
                    if (queue.length) {
                        const d = queue.shift()
                        d.reject(err)
                    }
                })
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

        api.forumKey = CONFIG.FORUM_KEY
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
            return this.globalData
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
            url: '/pages/regular-pages/post/post'
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
    isLogin() {
        if (!this.globalData.userInfo) {
            return wx.navigateTo({
                url: '/pages/regular-pages/login/login'
            })
        }
        return true
    },
    globalData: {
        userInfo: null
    }
})
