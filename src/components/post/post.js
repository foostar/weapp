const Component = require('../../lib/component.js')
const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()

function Post(key, module) {
    this.module = module
    Component.call(this, key)
    app.globalData.liststyle = module.style

    // 添加分页
    this.data = {
        page: 1,
        over: false,
        isFetching: false,
        iconsrc: app.globalData.iconSrc,
        isCommenting: true,
        actionSheetHidden: true,
        postData: module.data,
        isShow: false
    }
}
Post.prototype = Object.create(Component.prototype)
Post.prototype.name = 'post'
Post.prototype.constructor = Post
Post.prototype.onLoad = function () {
    const tid = this.data.postData.id || this.module.extParams.topicId
    this.fetchData(tid)
    app.event.on('login', () => {
        this.fetchData(tid)
    })
}
Post.prototype.fetchData = function (tid, option, control) {
    let list = this.data.list || []
    var options = option || {}
    var controls = control || {}
    if (controls.clearList) {
        list = options.page > 1 ? this.data.list.slice(0, (options.page - 1) * 20) : []
    }
    var systemInfo = app.globalData.systemInfo
    this.data.windowWidth = systemInfo.windowWidth
    this.data.windowHeight = systemInfo.windowHeight
    let request
    if (this.data.postData.type == 'post') {
        request = app.api.post(tid, options)
    } else {
        request = app.api.article(tid)
    }
    if (options.page == 1) {
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
    }
    return request.then((data) => {
        /* 处理页面详情参数 */
        if (data.page == 1) {
            wx.hideToast()
            if (app.globalData.userInfo && app.globalData.userInfo.uid == data.userId) {
                data.creater = true
            }
            if (data.content[0].content.charAt(0) == '#' && data.content[0].content.lastIndexOf('#') != 0) {
                const title = data.content[0].content.substr(0, data.content[0].content.indexOf('#', 1) + 1)
                data.content[0].content = data.content[0].content.replace(title, '')
                data.content[0].isTopic = true
                data.content.unshift({
                    infor: title,
                    content: title,
                    type: 3
                })
            }
            if (data.content.length > 1 && data.content[1].content.charAt(0) == '#' && data.content[1].content.lastIndexOf('#') != 0) {
                const title = data.content[1].content.substr(0, data.content[1].content.indexOf('#', 1) + 1)
                data.content[1].content = data.content[1].content.replace(title, '')
                data.content[1].isTopic = true
                data.content.unshift({
                    infor: title,
                    content: title,
                    type: 3
                })
            }
            data.content && data.content.forEach((v) => {
                if (v.type == 1) {
                    v.loadSrc = app.globalData.loadSrc
                    v.unloaded = true
                    if (controls.loaded) {
                        v.unloaded = false
                    }
                }
                if (v.type == 0) {
                    let faceResult
                    faceResult = infoToFace(v.content)
                    v.hasFace = faceResult.hasFace
                    v.subject = faceResult.data
                }
                if (v.type == 4) {
                    v.id = v.url.substr(-1)
                }
            })
            data.zanList.forEach((v) => {
                if (app.globalData.userInfo && v.recommenduid == app.globalData.userInfo.uid) {
                    data.like = 1
                }
            })
            if (data.type == 'post') {
                data.createAt = dateFormat(data.createAt)
            }
            data.isCommenting = true
            data.actionSheetHidden = true
        }
        /* 处理页面评论参数 */
        data.list && data.list.forEach((x) => {
            x.posts_date = dateFormat(x.posts_date)
            x.reply_content.forEach((v) => {
                if (v.type == 0) {
                    let faceResult
                    faceResult = infoToFace(v.infor)
                    v.hasFace = faceResult.hasFace
                    v.subject = faceResult.data
                }
            })
            if (x.is_quote == 1) {
                var quote = []
                quote.push(x.quote_content.substring(0, x.quote_content.indexOf(':') + 3))
                quote.push(x.quote_content.substring(x.quote_content.indexOf(':') + 4, x.quote_content.length))
                x.quote_subject = quote
            }
        })
        data.list = list.concat(data.list)
        data.over = data.page >= parseInt((data.totalNum / 20) + 1, 10)
        /* 处理投票贴 */
        data.isPoll = false
        if (data.poll && data.poll.poll_item_list) {
            data.isPoll = true
            data.poll.poll_item_list.forEach((v) => {
                v.per = parseInt(v.percent.substring(0, v.percent.indexOf('.')), 10)
            })
        }
        if (data.page > 1) {
            this.setData({
                list: data.list,
                page: data.page,
                over: data.over,
                totalNum: data.totalNum,
                isCommenting: true,
                actionSheetHidden: true
            })
        } else {
            this.setData(data)
        }
    }, (err) => {
        if (this.data.page == 1) {
            this.setData({
                isShow: true,
                errMessage: err.data.err.errcode
            })
            setTimeout(() => {
                this.setData({
                    isShow: false
                })
                wx.navigateBack({
                    delta: 1
                })
            }, 800)
        }
    })
}
/*
 * @图像重载
 */
Post.prototype.imageLoaded = function (e) {
    const windowWidth = this.data.windowWidth
    const imageWidth = e.detail.width
    const imageHeight = e.detail.height
    const index = e.currentTarget.dataset.index
    this.data.content[index].unloaded = false
    this.data.content[index].imageHeight = `${((windowWidth * imageHeight) / imageWidth).toFixed(2)}px`

    this.setData(this.data)
}
/*
 * @操作窗口
 */
Post.prototype.actionSheetTap = function (e) {
    const id = e.currentTarget.dataset.id
    this.setData({
        actionSheetHidden: !this.data.actionSheetHidden,
        reportUser: id,
        managePanel: []
    })
}

Post.prototype.actionSheetChange = function () {
    this.setData({
        actionSheetHidden: !this.data.actionSheetHidden
    })
}
/*
 * @下一页
 */
Post.prototype.nextPage = function () {
    var self = this
    let { page, over } = self.data
    if (!over) {
        this.setData({ isFetching: false })
        const tid = this.data.postData.id || this.module.extParams.topicId
        this.fetchData(tid, { page: page + 1 })
    }
}
/*
 *  @举报用户
 */
Post.prototype.reportUser = function (e) {
    if (!app.isLogin()) return
    this.setData({
        actionSheetHidden: true
    })
    var isType = 'thread'
    const id = e.currentTarget.dataset.id
    if (e.currentTarget.dataset.role) {
        isType = 'post'
    }
    app.api.report({ id, isType })
        .then((data) => {
            wx.showToast({
                title: data.errcode
            })
            this.cancelAction()
        })
}
/*
 *  @关注用户
 */
Post.prototype.foucsUser = function (e) {
    if (!app.isLogin()) return
    var type = 'follow',
            result = 1,
            self = this
    if (e.currentTarget.dataset.focus != 0) {
        type = 'unfollow'
        result = 0
    }
    app.api.useradmin({ uid: e.currentTarget.dataset.id, type })
        .then((data) => {
            wx.showToast({
                title: data.errcode
            })
            self.data.isFollow = result
            self.setData(self.data)
        })
}
/*
 *  @关闭操作按钮
 */
Post.prototype.cancelAction = function () {
    this.data.isCommenting = true
    this.setData(this.data)
}
/*
 *  @收藏操作
 */
Post.prototype.colletHandler = function (e) {
    if (!app.isLogin()) return
    var action = 'favorite'
    var isFavor = 1
    var idType = 'tid'
    var id = e.currentTarget.dataset.id
    var self = this
    if (e.currentTarget.dataset.collet == 1) {
        action = 'delfavorite'
        isFavor = 0
    }
    if (this.data.type == 'article') {
        idType = 'article'
        id = this.data.postData.id
    }
    app.api.userfavorite(id, { action, idType })
        .then((data) => {
            wx.showToast({
                title: data.errcode
            })
            self.setData({ colleted: isFavor })
        })
}
/*
 *  @点赞操作
 */
Post.prototype.likeHandler = function (e) {
    if (!app.isLogin()) return
    if (e.currentTarget.dataset.like == 1) return
    const id = e.currentTarget.dataset.id
    var self = this
    app.api.support(id, { type: 'topic' })
        .then((data) => {
            wx.showToast({
                title: data.errcode
            })
            this.data.like = 1
            this.data.zanList.push({
                'count(distinct recommenduid)': 1,
                dateline: Date.now(),
                recommenduid: app.globalData.userInfo.uid,
                tid: id,
                username: app.globalData.userInfo.userName
            })
            this.setData(self.data)
        })
}
/*
 *  @开始评论
 */
Post.prototype.comment = function (e) {
    var self = this
    if (this.data.type == 'post') {
        this.cancelAction()
        if (e.currentTarget.dataset.role && e.currentTarget.dataset.role == 'quote') {
            this.data.isQuote = e.currentTarget.dataset.quote
        } else {
            this.data.isQuote = 0
        }
        this.data.isCommenting = false
        this.setData(self.data)
    }
}
/*
 *  @评论提交
 */
Post.prototype.formSubmit = function (e) {
    if (!app.isLogin()) return
    var self = this
    if (this.data.type == 'post') {
        let data = {
            fid: self.data.boardId,
            isShowPostion: 0,
            aid: '',
            title: '',
            content: encodeURIComponent(JSON.stringify([ { type: 0, infor: e.detail.value.comment } ]))
        }
        data.isQuote = 0
        if (self.data.isQuote) {
            data.isQuote = 1
            data.replyId = self.data.isQuote
        }
        data.tid = self.data.id
        return app.api.createTopic(data, {
            platType: 1,
            act: 'reply'
        })
        .then((result) => {
            wx.showToast({
                title: result.errcode
            })
            self.formReset()
            self.fetchData(this.data.id, { page: this.data.page }, {
                loaded: true,
                clearList: true
            })
        })
    }
    // article
    app.api.replyArticle({
        id: this.data.postData.id,
        idType: 'aid',
        content: e.detail.value.comment
    })
    .then((data) => {
        console.log(data)
    })
}
/*
 *  @表单重置
 */
Post.prototype.formReset = function () {
    // console.log('form发生了reset事件'
}
/*
 *  @访问用户主页
 */
Post.prototype.checkUser = function (e) {
    if (e.currentTarget.dataset.id) {
        app.showUserHome(e.currentTarget.dataset.id)
    }
}
/*
 *  @访问话题列表
 */
Post.prototype.checkBoard = function (e) {
    app.topic({ id: e.currentTarget.dataset.id, type: 'tid' })
}
module.exports = Post

