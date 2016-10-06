var mobcent = require('./lib/mobcent.js')
var util = require('./utils/util.js')

App({
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        const api = this.api = new mobcent.API('http://bbs.xiaoyun.com', {
            parse: response => {
                response.ok = true
                return { json: response.data, response }
            },
            fetch: (url, data) => {
                // console.log(url, data)
                return new Promise((resolve, reject) => {
                    wx.request({
                        url: url,
                        data: data.body,
                        header: data.headers,
                        method: data.method,
                        success: resolve,
                        error: reject
                    })
                })
            }
        })
        const promise = Promise.all([
            api.app(),
            api.ui()
        ]).then(([appResult, uiResult]) => {
            const info = this.globalData.info = appResult.body.data
            const modules = this.globalData.modules = {}
            const tabs = this.globalData.tabs = uiResult.body.navigation.navItemList
            uiResult.body.moduleList.forEach(x => {
                modules[x.id] = x
            })
            this.globalData.moduleId = tabs[0].moduleId
                // console.log(this.globalData)
            return this.globalData
        })
        this.ready = () => promise
    },
    getModule(id) {
        if (id === undefined || id === null) {
            id = this.globalData.moduleId
        }
        return this.globalData.modules[id]
    },
    getResources(module) {
        if (typeof module !== 'object') {
            return this.getResources(this.getModule(module))
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
                        return api.news(module.extParams.newsModuleId).then(data => {
                            resources[module.id] = data
                        })
                    } else if (module.type === 'forumlist') {
                        // resources[ module.id ] = await api.forumList()
                        // resources[ module.id ].rec = await api.recForumList()
                    } else if (module.type === 'topiclistSimple') {
                        return api.forum(module.extParams.forumId, {
                            sortby: module.extParams.orderby || 'all'
                        }).then(data => {
                            data.list = data.list.map(v => {
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
                        // if (parent.type === 'layout') return
                        // const ref = entities.modules[ module.extParams.moduleId ]
                        // if (ref.type === 'custom') {
                        //     Object.assign(ref, camelizeKeys((await api.custom(ref.id)).body.module))
                        // }
                        // await getResources(ref, m)
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
        return getResources(module).then(() => resources)
    },
    to(module, isReplace) {
        let to = wx.navigateTo
        if (isReplace) {
            to = wx.redirectTo
        }
        if (typeof module !== 'object') {
            return this.to(this.getModule(module), isReplace)
        }
        console.log('====>', module)
        this.globalData.moduleId = module.id
        if (module.type === 'full') {
            if (module.componentList[0].type === 'discover') {
                return to({
                    url: '/pages/regular-pages/my/my'
                })
            }

            if (module.componentList[0].type === 'forumlist') {
                return to({
                    url: '/pages/regular-pages/community/community'
                })
            }
        }

        to({
            url: '/pages/index/index'
        })
    },
    getUserInfo: function(cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                success: function() {
                    wx.getUserInfo({
                        success: function(res) {
                            that.globalData.userInfo = res.userInfo
                            typeof cb == "function" && cb(that.globalData.userInfo)
                        }
                    })
                }
            })
        }
    },
    globalData: {
        userInfo: null
    }
})
