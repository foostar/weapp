const mobcent = require('./lib/mobcent.js')
const util = require('./utils/util.js')
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
                })
                requestNum += 1
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
                    requestNum -= 1
                    if (queue.length) {
                        const d = queue.shift()
                        d.request().then(d.resolve, d.reject)
                    }
                })
                return promise
            }
        })
        const custom = api.custom
        api.custom = function () {
            return custom.apply(api, arguments).then((data) => {
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
            const tabs = this.globalData.tabs = uiResult.body.navigation.navItemList
            // 处理没有ID的module
            uiResult.body.moduleList.forEach((x) => {
                modules[x.id] = x
                x.componentList.forEach(completeId)
            })
            this.globalData.moduleId = tabs[0].moduleId
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
    getModule(id) {
        if (id === undefined || id === null) {
            id = this.globalData.moduleId
        }
        return this.globalData.modules[id]
    },
    getResources(m) {
        if (typeof m !== 'object') {
            return this.getResources(this.getModule(m))
        }
        const api = this.api
        const resources = {}
        const getResources = (module) => {
            return Promise.resolve()
                .then(() => {
                    if (Array.isArray(module)) {
                        return Promise.all(module.map(x => getResources(x)))
                    }
                    if (module.type === 'newslist') {
                        return api.news(module.extParams.newsModuleId).then((data) => {
                            resources[module.id] = data
                        })
                    } else if (module.type === 'forumlist') {
                        return Promise.all([
                            api.forumList(),
                            api.recForumList()
                        ]).then(([ forumList, recForumList ]) => {
                            resources[module.id] = forumList
                            resources[module.id].rec = recForumList
                        })
                    } else if (module.type === 'topiclistSimple') {
                        return api.forum(module.extParams.forumId, {
                            sortby: module.extParams.orderby || 'all'
                        }).then((data) => {
                            data.list = data.list.map((v) => {
                                v.imageList = v.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_'))
                                v.last_reply_date = util.formatTime(v.last_reply_date)
                                v.subject = util.formateText(v.subject)
                                return v
                            })
                            resources[module.id] = data
                        })
                    } else if (module.type === 'talk') {
                        // const topics = await api.topic()
                        // const mytopics = user ? (await api.mytopic()) : null
                        // resources[ module.id ] = {
                        //     extParams: module.extParams,
                        //     topics,
                        //     mytopics,
                        // }
                    } else if (module.type === 'moduleRef') {
                        /*if (parent.type === 'layout') return
                        const ref = this.globalData.modules[ module.extParams.moduleId ]
                        if (ref.type === 'custom') {
                            // Object.assign(ref, camelizeKeys((await api.custom(ref.id)).body.module))
                        }
                        return getResources(ref)*/
                    } else if (module.type === 'subnav') {
                        return getResources(module.componentList)
                    } else if (module.type === 'full') {
                        return getResources(module.componentList)
                    } else if (module.type === 'layout') {
                        return getResources(module.componentList)
                    } else if (module.type === 'customSubnav') {
                        return getResources(module.componentList)
                    }
                })
        }
        return getResources(m).then(() => resources)
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
