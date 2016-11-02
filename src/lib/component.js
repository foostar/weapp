const { load } = require('./createpage')
const components = require('./components')

function scrollChildren(children, event) {
    /* eslint-disable */
    const ListComponent = require('./listcomponent')
    /* eslint-enable */
    Object.keys(children).forEach((key) => {
        const child = children[key]
        if (!child || !child.shown) return
        if (child instanceof ListComponent) {
            /* eslint-disable */
            child._onScrollToLower(event)
            /* eslint-enable */
        } else {
            scrollChildren(child.children, event)
        }
    })
}


const fns = {
    scrollToLower(event) {
        scrollChildren(this.children, event)
    }
}

function Component(key) {
    if (!this.name) {
        throw new Error('请覆盖 name 属性')
    }
    this.children = {}
    this.key = key
    this.loaded = false
    this.shown = false

    Object.keys(fns).forEach((name) => {
        this.constructor.prototype[name] = fns[name]
    })
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

Component.prototype.remove = function (child) {
    if (!child) {
        return
    }
    delete child.parent
    delete child.page
    delete this.children[child.key]
    child.unload()
}

Component.prototype.ready = function () {
    if (this.isReady) return
    if (!this.loaded) return
    this.isReady = true
    const children = this.children
    Object.keys(children).forEach((key) => {
        this.children[key].ready()
    })
    this.onReady()
}

Component.prototype.load = function () {
    if (this.loaded) return
    this.loaded = true
    const children = this.children
    load.call(this, children)
    if (this.page.shown) {
        this.show()
    } else {
        this.page.once('show', () => {
            this.show()
        })
    }
    this.onLoad()
}

Component.prototype.unload = function () {
    if (!this.loaded) return
    this.loaded = false
    const children = this.children
    Object.keys(children).forEach((key) => {
        this.children[key].unload()
    })
    if (this.page.shown) {
        this.hide()
    }
    this.onUnload()
}

Component.prototype.show = function () {
    if (this.shown) {
        return
    }
    this.shown = true
    this.onShow()
}

Component.prototype.hide = function () {
    if (!this.shown) {
        return
    }
    this.shown = false
    this.onHide()
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

Component.prototype.onLoad = function () {}
Component.prototype.onUnload = function () {}
Component.prototype.onShow = function () {}
Component.prototype.onHide = function () {}
Component.prototype.onReady = function () {}

module.exports = Component
