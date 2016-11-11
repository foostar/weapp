const Component = require('../../lib/component')
const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()

function Post(key) {
    Component.call(this, key)
    // 添加分页
    this.data = {
        topic: null,
        endPage: 0,
        isLoading: false,
        over: false,
        isFetching: false,
        iconsrc: app.globalData.iconSrc,
        isCommenting: true,
        actionSheetHidden: true
    }
}
Post.prototype = Object.create(Component.prototype)
Post.prototype.name = 'post'
Post.prototype.constructor = Post
Post.prototype.onLoad = function () {
    this.fetchData(app.globalData.postId)
    app.event.on('login', () => {
        this.fetchData(app.globalData.postId)
    })
}
Post.prototype.fetchData = function (tid, option) {
    var self = this
    this.data.isLoading = false
    this.setData(self.data)
    var options = option || {}
    var isLike = 0
    var systemInfo = wx.getSystemInfoSync()
    this.data.windowWidth = systemInfo.windowWidth
    this.data.windowHeight = systemInfo.windowHeight
    app.api.post(tid, options)
        .then((data) => {
            data.topic.create_date = dateFormat(data.topic.create_date)
            if (app.globalData.userInfo && app.globalData.userInfo.uid == data.topic.user_id) {
                data.creater = true
            }
            data.topic.zanList.forEach((v) => {
                if (app.globalData.userInfo && v.recommenduid == app.globalData.userInfo.uid) {
                    isLike = 1
                }
            })
            data.topic.isLike = isLike
            data.list.forEach((x) => {
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
            data.topic.content.forEach((v) => {
                if (v.type == 0) {
                    let faceResult
                    faceResult = infoToFace(v.infor)
                    v.hasFace = faceResult.hasFace
                    v.subject = faceResult.data
                }
                if (v.type == 1) {
                    v.loadSrc = app.globalData.loadSrc
                    v.unloaded = true
                }
            })
            data.endPage = parseInt((data.total_num / 20) + 1, 10)
            data.isLoading = true
            data.over = false
            data.isCommenting = true
            data.actionSheetHidden = true
            this.setData(data)
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
    this.data.topic.content[index].unloaded = false
    this.data.topic.content[index].imageHeight = `${((windowWidth * imageHeight) / imageWidth).toFixed(2)}px`

    this.setData(this.data)
}
/*
 * @操作窗口
 */
Post.prototype.actionSheetTap = function (e) {
    const id = e.currentTarget.dataset.id
    /* if (!e.currentTarget.dataset.role) {
         this.data.list.forEach((v) => {
            if (v.reply_posts_id == id) {
                self.data.managePanel = v.managePanel
            }
        })
        self.data.managePanel = []
    } else {
        self.data.managePanel = self.data.topic.managePanel
    }*/
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
    let { page, endPage } = self.data
    if (page < endPage) {
        this.setData({ isFetching: true })
        this.fetchData(self.data.module, { page: page + 1 })
    } else {
        this.setData({
            isFetching: false,
            over: true
        })
    }
}
/*
 *  @举报用户
 */
Post.prototype.reportUser = function (e) {
    if (!app.isLogin()) return
    this.setData({
        actionSheetHidden: true,
        isLoading: false
    })
    var isType = 'thread'
    const id = e.currentTarget.dataset.id
    if (e.currentTarget.dataset.role) {
        isType = 'post'
    }
    app.api.report({ id, isType })
        .then(() => {
            this.data.isLoading = true
            console.log('举报成功')
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
        .then(() => {
            self.data.topic.isFollow = result
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
    var self = this
    if (e.currentTarget.dataset.collet == 1) {
        action = 'delfavorite'
        isFavor = 0
    }
    app.api.userfavorite(e.currentTarget.dataset.id, { action, idType: 'tid' })
        .then(() => {
            self.setData({ 'topic.is_favor': isFavor })
        })
}
/*
 *  @点赞操作
 */
Post.prototype.likeHandler = function (e) {
    if (!app.isLogin) return
    if (e.currentTarget.dataset.like == 1) return
    const id = e.currentTarget.dataset.id
    var self = this
    app.api.support(id, { type: 'topic' })
        .then(() => {
            this.data.topic.isLike = 1
            this.data.isLoading = true
            this.data.topic.zanList.push({
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
    this.cancelAction()
    if (e.currentTarget.dataset.role && e.currentTarget.dataset.role == 'quote') {
        this.data.isQuote = e.currentTarget.dataset.quote
    } else {
        this.data.isQuote = 0
    }
    this.data.isCommenting = false
    this.setData(self.data)
}
/*
 *  @评论提交
 */
Post.prototype.formSubmit = function (e) {
    if (!app.isLogin()) return
    var self = this
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
    data.tid = self.data.topic.topic_id
    app.api.createTopic(data, {
        platType: 1,
        act: 'reply'
    })
    .then(() => {
        self.formReset()
        self.fetchData(app.globalData.postId)
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
}
/*
 *  @表单重置
 */
Post.prototype.formReset = function () {
    console.log('form发生了reset事件')
}
module.exports = Post

