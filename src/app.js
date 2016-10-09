const mobcent = require('./lib/mobcent.js')
const util = require('./utils/util.js')
const Events = require('./lib/Events.js')

App({
    onLaunch() {
        // 添加监听事件
        const event = this.event = new Events()
        event.trigger('launch')

        const api = this.api = new mobcent.API('http://bbs.xiaoyun.com', {
            parse: (response) => {
                response.ok = true
                return { json: response.data, response }
            },
            fetch: (url, data) => {
                // console.log(url, data)
                return new Promise((resolve, reject) => {
                    wx.request({
                        // url: url,
                        url: `http://weapp.apps.xiaoyun.com/client/${encodeURIComponent(url)}`,
                        data: data.body,
                        header: data.headers,
                        method: data.method,
                        success: resolve,
                        error: reject
                    })
                })
            }
        })
        api.forumKey = 'jVXS7QIncwlSJ86Py1'
        const promise = Promise.all([
            api.app(),
            api.ui()
        ]).then(([ appResult, uiResult ]) => {
            this.globalData.info = appResult.body.data
            const modules = this.globalData.modules = {}
            const tabs = this.globalData.tabs = uiResult.body.navigation.navItemList
            uiResult.body.moduleList.forEach((x) => {
                modules[x.id] = x
            })
            this.globalData.moduleId = tabs[0].moduleId
                // console.log(this.globalData)
            return this.globalData
        })
        this.ready = () => promise
        // 微信登录
        // this.getUserInfo((res) => {
        //     console.log(res)
        // })
        var userInfo = wx.getStorageSync('userInfo')
        this.globalData.userInfo = userInfo
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
                        // resources[ module.id ] = await api.forumList()
                        // resources[ module.id ].rec = await api.recForumList()
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
        return getResources(m).then(() => resources)
    },
    to(module, isReplace) {
        let to = wx.navigateTo
        if (isReplace) {
            to = wx.redirectTo
        }
        if (typeof module !== 'object') {
            return this.to(this.getModule(module), isReplace)
        }
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

        // todo 后期合并 yuchunyu
        if (module.type === 'subnav') {
            // 话题列表
            if (module.componentList[0].type === 'talk') {
                return to({
                    url: '/pages/regular-pages/topic-list/topic-list'
                })
            }
        }

        to({
            url: '/pages/index/index'
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
    globalData: {
        userInfo: null
    }
})
