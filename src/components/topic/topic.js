const ListComponent = require('../../lib/listcomponent.js')
const util = require('../../utils/util.js')

const app = getApp()
// 话题页面

function Topic(key, module) {
    if (module.data) {
        this.papeData = module.data
    }
    this.module = module
    ListComponent.call(this, key)
    this.data = {
        id: '',
        tpcinfo: {},
        topUser: [],
        partinNum: 0,
        newList: [],
        hotList: [],
        currentIndex: 1
    }
}
Topic.prototype = Object.create(ListComponent.prototype)
Topic.prototype.name = 'topic'
Topic.prototype.constructor = Topic

Topic.prototype.fetchData = function (param, number) {
    const currentIndex = parseInt(this.data.currentIndex, 10)
    // NEW HOT
    /* eslint-disable */
    const ti_id = (this.papeData ? this.papeData.id : null) || this.module.extParams.talkId
    /* eslint-enable */
    let list = param.list || currentIndex === 1 ? this.data.newList : this.data.hotList || []
    if (this.data.over) return Promise.reject()
    this.setData({
        isLoading: true,
        color: `#${app.config.COLOR}`
    })
    return app.api.topicdtl({
        ti_id,
        page: param.page,
        orderby: currentIndex === 1 ? 'NEW' : 'HOT'
    }).then((data) => {
        data.list = data.list.map(x => ({
            id: x.topic_id,
            forumId: x.board_id,
            forumName: x.board_name,
            title: util.formateText(x.title),
            topTopicList: x.topTopicList,
            user: {
                id: x.user_id,
                nickname: x.user_nick_name,
                avatar: x.userAvatar,
                title: x.userTitle
            },
            repliedAt: util.formatTime(x.last_reply_date),
            views: x.hits,
            replies: x.replies,
            subject: util.formateText(x.subject),
            gender: x.gender,
            images: x.imageList.map(src => src.replace('xgsize_', 'mobcentSmallPreview_')),
            zans: x.zanList
        }))

        data.list = list.concat(data.list)
        if (data.page == 1) {
            this.setData({
                tpcinfo: data.tpcinfo,
                topUser: data.topUser,
                partinNum: data.partinNum
            })
        }
        if (currentIndex === 1) {
            this.setData({
                newList: data.list,
                isLoading: false,
                over: param.page >= parseInt((data.total_num / number) + 1, 10)
            })
        } else {
            this.setData({
                hotList: data.list,
                isLoading: false,
                over: param.page >= parseInt((data.total_num / number) + 1, 10)
            })
        }
    }, () => {
        this.setData({ resources: {}, over: true, isLoading: false })
    })
}

Topic.prototype.changeTabs = function (e) {
    // 切换选项卡
    this.setData({
        currentIndex: e.currentTarget.dataset.index
    })
    const { index } = e.currentTarget.dataset
    const currentIndex = Number(index)
    this.setData({ currentIndex, newList: [], hotList: [], over: false })
    this.pageIndex = 1
    this.fetchData({
        page: this.pageIndex
    }, 20)
}
Topic.prototype.toUserHome = function (e) {
    wx.navigateTo({
        url: `/pages/blank/blank?type=userhome&data=${JSON.stringify({ uid: e.currentTarget.dataset.uid })}`
    })
}
Topic.prototype.clickItem = function (e) {
    app.showPost({ type: 'post', id: e.currentTarget.id })
}

module.exports = Topic
