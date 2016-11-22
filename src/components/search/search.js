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
        over: false
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
        searchType: type
    })
}

Search.prototype.searchData = function () {
    this.fetchData({ page: 0 }, 20)
}

Search.prototype.fetchData = function (param, number) {
    const { searchType, searchValue, postList, articleList, userList } = this.data
    let list = []
    const type = {
        post: list.concat(postList),
        article: list.concat(articleList),
        user: list.concat(userList)
    }
    list = type[searchType]
    if (searchValue === null) return Promise.reject()

    this.setData({
        isLoading: true
    })

    return app.api.search(searchValue, searchType, {
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
        console.log(list)

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
                over: param.page >= parseInt((data.total_num / number) + 1, 10)
            })
        }
    })
}


module.exports = Search
