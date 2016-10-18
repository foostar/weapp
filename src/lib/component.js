const { load } = require('./createpage')

function Component(key) {
    if (!this.name) {
        throw new Error('请覆盖 name 属性')
    }
    this.children = {}
    this.key = key
    this.loaded = false
}

Component.prototype.add = function (child) {
    if (!child) {
        return
    }
    child.parent = this
    child.page = this.page
    this.children[child.key] = child
    if (this.loaded) {
        child.load()
    }
}

Component.prototype.setData = function (data) {
    this.data = Object.assign({}, this.data, data)
    this.parent.setData({
        children: {
            [this.key]: this.data
        }
    })
}

Component.prototype.load = function () {
    if (this.loaded) return
    const children = this.children
    load.call(this, children)
    this.onLoad()
}

Component.prototype.onLoad = function () {}

module.exports = Component
