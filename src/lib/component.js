function Component(key) {
    if (!this.name) {
        throw new Error('请覆盖 name 属性')
    }
    this.children = {}
    this.key = key
}

Component.prototype.add = function (child) {
    child.parent = this
    this.children[child.key] = child
}

Component.prototype.setData = function (data) {
    this.data = Object.assign({}, this.data, data)
    this.parent.setData({
        children: {
            [this.key]: this.data
        }
    })
}

module.exports = Component
