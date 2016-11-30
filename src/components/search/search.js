const ListComponent = require('../../lib/listcomponent.js')
const { dateFormat, formateText } = require('../../utils/util.js')

const app = getApp()

function Search(key) {
    ListComponent.call(this, key)
    this.data = {
        iconSrc: app.globalData.iconSrc,
        btnWidth: `${100 / 3}%`,
        searchValue: null,
        searchType: 'post',
        isLoading: false,
        postList: [],
        articleList: [],
        userList: [],
        errCode: false,
        errMessage: null,
        over: false,
        userOverPage: -1

    }
}

Search.prototype = Object.create(ListComponent.prototype)
Search.prototype.name = 'search'
Search.prototype.constructor = Search

Search.prototype.changeInput = function (e) {
    const { value: searchValue } = e.detail
    this.setData({
        searchValue
    })
}
Search.prototype.click = function (e) {
    const { index: type } = e.currentTarget.dataset
    this.setData({
        isLoading: false,
        over: false,
        searchType: type
    })
}

Search.prototype.searchData = function () {
    this.fetchData({ page: 1 }, 20)
    this.setData({
        errCode: false,
        postList: [],
        articleList: [],
        userList: []
    })
}

Search.prototype.fetchData = function (param, number) {
    const { searchType, searchValue, postList, articleList, userList, userOverPage } = this.data
    if (searchValue === null) return Promise.reject()
    let encodeSearchValue = encodeURIComponent(searchValue)
    let list = []
    const type = {
        post: list.concat(postList),
        article: list.concat(articleList),
        user: list.concat(userList)
    }
    list = type[searchType]
    this.setData({
        isLoading: true
    })
    if (userOverPage > 0 && param.page >= userOverPage) {
        this.setData({
            isLoading: false,
            over: param.page >= userOverPage
        })
        return Promise.reject()
    }

    return app.api.search(encodeSearchValue, searchType, {
        page: param.page
    }).then(data => {
        if (searchType == 'post' || searchType === 'article') {
            data.list.map((item, index) => {
                data.list[index].repliedAt = dateFormat(item.repliedAt, 'yyyy-MM-dd', false)
                data.list[index].subject = formateText(data.list[index].subject)
                if (item.images[0]) {
                    data.list[index].images[0] = (item.images[0].replace('xgsize_', 'mobcentSmallPreview_'))
                } else {
                    data.list[index].images = []
                }
                return data
            })
            list = list.concat(data.list)
        } else {
            data.body.list.map((item, index) => {
                data.body.list[index].dateline = dateFormat(item.dateline, 'yyyy-MM-dd', false)
                return data
            })
            list = list.concat(data.body.list)
        }
        if (searchType === 'post') {
            this.setData({
                postList: list,
                isLoading: false,
                over: param.page >= parseInt((data.meta.total / number) + 1, 10)
            })
        }
        if (searchType === 'article') {
            this.setData({
                articleList: list,
                isLoading: false,
                over: param.page >= parseInt((data.meta.total / number) + 1, 10)
            })
        }
        if (searchType === 'user') {
            this.setData({
                userList: list,
                isLoading: false,
                userOverPage: parseInt((data.total_num / number) + 1, 10),
                over: param.page >= parseInt((data.total_num / number) + 1, 10)
            })
        }
    }, err => {
        this.setData({
            errCode: true,
            errMessage: err.data.errcode,
            isLoading: false,
            over: false
        })
    })
}

Search.prototype.toUserhome = function (e) {
    const uid = e.currentTarget.dataset.uid
    app.showUserHome(uid)
}

Search.prototype.foucsUser = function (e) {
    let index = e.currentTarget.dataset.index
    if (!app.isLogin()) return
    let type = 'follow'
    let result = 1
    let self = this
    if (e.currentTarget.dataset.focus != 0) {
        type = 'unfollow'
        result = 0
    }
    app.api.useradmin({ uid: e.currentTarget.dataset.uid, type })
        .then((data) => {
            wx.showToast({
                title: data.errcode
            })
            self.data.userList[index].isFollow = result
            self.setData(self.data)
        })
}
Search.prototype.showPost = function (e) {
    const { id } = e.currentTarget
    app.showPost({ id, type: 'post' })
}

Search.prototype.showArticle = function (e) {
    const { id } = e.currentTarget
    app.showPost({ id, type: 'article' })
}


module.exports = Search
