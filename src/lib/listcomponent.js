const Component = require('./component')

function ListComponent(key) {
    Component.call(this, key)
    this.pageIndex = 0
    this.pageNumber = 20
    this.isFetching = false
}

ListComponent.prototype = Object.create(Component.prototype)
ListComponent.prototype.constructor = ListComponent

ListComponent.prototype.onLoad = function () {
    this.nextPage()
}

ListComponent.prototype.nextPage = function () {
    if (this.isFetching) return
    this.isFetching = true
    this.fetchData(this.pageIndex + 1, this.pageNumber)
        .then(() => {
            this.pageIndex += 1
            this.isFetching = false
        })
        .then(() => {
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
