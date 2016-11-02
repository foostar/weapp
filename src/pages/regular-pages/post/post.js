const { dateFormat, infoToFace } = require('../../../utils/util.js')

const app = getApp()

const attribs = (node) => {
    if (node.attrs) {
        node.attribs = {}
        node.attrs.forEach((attr) => {
            node.attribs[attr.name] = attr.value
        })
    }
    if (node.parentNode) {
        delete node.parentNode
    }
    node.childNodes && node.childNodes.forEach((child) => {
        attribs(child)
    })
    return node
}

Page({
    data: {
        topic: null,
        endPage: 0,
        isLoading: false,
        over: false,
        isFetching: false,
        isCommenting: true
    },
    onLoad() {
        this.fetchData(app.globalData.postId)
        app.event.on('login', () => {
            this.fetchData(app.globalData.postId)
        })
    },
    fetchData(tid, option) {
        var self = this
        this.data.isLoading = false
        this.setData(self.data)
        var options = option || {}
        var isLike = 0
        app.api.post(tid, options)
            .then((data) => {
                data.topic.create_date = dateFormat(data.topic.create_date)
                if (app.globalData.userInfo && app.globalData.userInfo.uid == data.topic.user_id) {
                    data.creater = true
                }
                data.topic.zanList.forEach((v) => {
                    if (app.globalData.userInfo.uid && v.recommenduid == app.globalData.userInfo.uid) {
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
                })
                data.endPage = parseInt((data.total_num / 20) + 1, 10)
                data.isLoading = true
                data.over = false
                data.isCommenting = true
                data.actionSheetHidden = true
                this.setData(data)
            })
    },
    actionSheetTap(e) {
        var self = this
        const id = e.currentTarget.dataset.id
        this.data.actionSheetHidden = !this.data.actionSheetHidden
        this.data.reportUser = id
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
        self.data.managePanel = []
        this.setData(self.data)
    },
    actionSheetChange() {
        var self = this
        this.data.actionSheetHidden = !this.data.actionSheetHidden
        this.setData(self.data)
    },
    /*
     * @下一页
     */
    nextPage() {
        var that = this
        let { page, endPage } = that.data
        if (page < endPage) {
            that.data.isFetching = true
            that.setData(that.data)
            that.fetchData(that.data.module, { page: page + 1 })
        } else {
            that.data.isFetching = false
            that.data.over = true
            that.setData(that.data)
            console.log(that.data)
        }
    },
    /*
     *  @展示操作按钮
     */
    /*showAction(e) {
        if (e.currentTarget.dataset.role) {
            this.data.isShow = !this.data.isShow
            return this.setData(this.data)
        }
        const id = e.currentTarget.dataset.id
        this.data.list.forEach((x) => {
            if (x.reply_posts_id == id) {
                x.isShow = !x.isShow
            }
        })
        this.setData(this.data)
    },*/
    /*
     *  @举报用户
     */
    reportUser(e) {
        if (!app.isLogin()) return
        this.data.actionSheetHidden = true
        this.data.isLoading = false
        this.setData(this.data)
        var isType = 'thread'
        var self = this
        const id = e.currentTarget.dataset.id
        if (e.currentTarget.dataset.role) {
            isType = 'post'
        }
        app.api.report({ id, isType })
            .then(() => {
                self.data.isLoading = true
                console.log('举报成功')
                self.cancelAction()
            })
    },
    /*
     *  @关注用户
     */
    foucsUser(e) {
        if (!app.isLogin()) return
        this.data.isLoading = false
        this.setData(this.data)
        var type = 'follow',
                result = 1,
                self = this
        if (e.currentTarget.dataset.focus != 0) {
            type = 'unfollow'
            result = 0
        }
        app.api.useradmin({ uid: e.currentTarget.dataset.id, type })
            .then(() => {
                self.data.isLoading = true
                self.data.topic.isFollow = result
                self.setData(self.data)
            })
    },
    /*
     *  @关闭操作按钮
     */
    cancelAction() {
        this.data.isCommenting = true
        this.setData(this.data)
    },
    /*
     *  @点赞操作
     */
    likeHandler(e) {
        if (!app.isLogin) return
        if (e.currentTarget.dataset.like == 1) return
        const id = e.currentTarget.dataset.id
        var self = this
        this.data.isLoading = false
        this.setData(this.data)
        app.api.support(id, { type: 'topic' })
            .then(() => {
                self.data.topic.isLike = 1
                self.data.isLoading = true
                self.data.topic.zanList.push({
                    'count(distinct recommenduid)': 1,
                    dateline: Date.now(),
                    recommenduid: app.globalData.userInfo.uid,
                    tid: id,
                    username: app.globalData.userInfo.userName
                })
                self.setData(self.data)
            })
    },
    /*
     *  @收藏操作
     */
    colletHandler(e) {
        if (!app.isLogin()) return
        this.data.isLoading = false
        this.setData(this.data)
        var action = 'favorite'
        var isFavor = 1
        var self = this
        if (e.currentTarget.dataset.collet == 1) {
            action = 'delfavorite'
            isFavor = 0
        }
        app.api.userfavorite(e.currentTarget.dataset.id, { action, idType: 'tid' })
            .then((data) => {
                self.data.topic.is_favor = isFavor
                self.data.isLoading = true
                self.setData(self.data)
                console.log(data)
            })
    },
    /*
     *  @开始评论
     */
    comment(e) {
        var self = this
        this.cancelAction()
        if (e.currentTarget.dataset.role && e.currentTarget.dataset.role == 'quote') {
            this.data.isQuote = e.currentTarget.dataset.quote
        }
        this.data.isCommenting = false
        this.setData(self.data)
    },
    /*
     *  @评论提交
     */
    formSubmit(e) {
        if (!app.isLogin()) return
        var self = this
        self.data.isLoading = false
        this.setData(self.data)
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
    },
    /*
     *  @表单重置
     */
    formReset() {
        console.log('form发生了reset事件')
    },
    onReady() {
    }
})
