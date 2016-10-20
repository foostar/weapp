const { load } = require('./createpage')
const components = require('./components')

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

Component.prototype.addByModule = function (module) {
    if (Array.isArray(module)) {
        return module.forEach(this.addByModule.bind(this))
    }
    this.add(components.create(module))
}

Component.prototype.setData = function (data) {
    if (data.children && this.data && this.data.children) {
        data.children = Object.assign({}, this.data.children, data.children)
    }
    this.data = Object.assign({
        key: this.key,
        template: this.name,
        components: components.template
    }, this.data, data)
    this.parent.setData({
        children: {
            [this.key]: this.data
        }
    })
}

Component.prototype.load = function () {
    if (this.loaded) return
    this.loaded = true
    const children = this.children
    load.call(this, children)
    this.onLoad()
}

Component.prototype.onLoad = function () {}

module.exports = Component
