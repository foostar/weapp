const ListComponent = require('../../lib/listcomponent.js')

// const { dateFormat, infoToFace } = require('../../utils/util.js')

const app = getApp()

function Search(key) {
    ListComponent.call(this, key)
    this.data = {
        iconSrc: app.globalData.iconSrc,
        searchValue: null,
        searchType: ''
    }
}

Search.prototype = Object.create(ListComponent.prototype)
Search.prototype.name = 'search'
Search.prototype.constructor = Search

Search.prototype.changeInput = function (e) {
    const { value: searchValue } = e.detail
    console.log(searchValue)
    this.setData({
        searchValue
    })
}

Search.prototype.fetchData = function () {
}


module.exports = Search
