const ListComponent = require('../../lib/listcomponent.js')
const { dateFormat } = require('../../utils/util.js')

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
    console.log(e)
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

    app.api.search(searchValue, searchType, {
        page: param.page
    }).then(data => {
        console.log(data)
        data.list.map((item, index) => {
            data.list[index].images = []
            data.list[index].last_reply_date = dateFormat(item.last_reply_date, 'yyyy-MM-dd', false)
            data.list[index].images.push(item.pic_path.replace('xgsize_', 'mobcentSmallPreview_'))

            return data
        })
        console.log(data)
        list = list.concat(data.list)
        if (searchType === 'post') {
            this.setData({
                postList: list,
                isLoading: false,
                over: param.page >= parseInt((data.total_num / number) + 1, 10)
            })
        }
        if (searchType === 'article') {
            this.setData({
                articleList: list,
                isLoading: false,
                over: param.page >= parseInt((data.total_num / number) + 1, 10)
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
