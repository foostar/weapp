const Component = require('./component.js')

var app = getApp()
function ListComponent(key) {
    Component.call(this, key)
    this.pageIndex = 0
    this.pageNumber = 20
    this.isFetching = false
    this.resources = {}
    this.orderby = ''
}

ListComponent.prototype = Object.create(Component.prototype)
ListComponent.prototype.constructor = ListComponent

ListComponent.prototype.onLoad = function () {
    this.nextPage()
    app.event.on('login', () => {
        this.pageIndex = 0
        this.isFetching = false
        this.nextPage()
    })
}

ListComponent.prototype.nextPage = function () {
    if (this.isFetching) return
    this.isFetching = true
    this.fetchData({
        page: this.pageIndex + 1,
        orderby: this.orderby
    }, this.pageNumber)
        .then(() => {
            this.pageIndex += 1
            this.isFetching = false
        }, () => {
            this.isFetching = false
        })
}
/* eslint-disable */
ListComponent.prototype._onScrollToLower = function () {
/* eslint-enable */
    this.onScrollToLower()
    this.nextPage()
}

ListComponent.prototype.onScrollToLower = function () {}

module.exports = ListComponent
