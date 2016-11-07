const Events = require('./events')

const bindHandlers = (page, children) => {
    const types = {}
    Object.keys(children).forEach((key) => {
        const component = children[key]
        types[component.name] = component.constructor
    })
    Object.keys(types).forEach((key) => {
        Object.getOwnPropertyNames(types[key].prototype)
            .forEach((name) => {
                page[`${key}_${name}`] = function (event) {
                    const component = children[event.currentTarget.dataset.eventKey]
                    /* eslint-disable */
                    component[name].apply(component, arguments)
                    /* eslint-enable */
                }
            })
    })
    // Object.keys(children).forEach((key) => {
    //     const component = children[key]
    //     if (component.children) {
    //         bindHandlers(page, component.children)
    //     }
    // })
}

const load = function (children) {
    const data = {}
    Object.keys(children).forEach((key) => {
        const component = children[key]
        data[key] = component.data
    })

    // 递归绑定子控件事件方法
    bindHandlers(this.page || this, children)
    this.setData({ children: data })
    Object.keys(children).forEach((key) => {
        const child = children[key]
        if (child.parent.page) {
            child.page = child.parent.page
        }
        child.load()
    })
}

function createPage(config) {
    // const component = new Component(key)
    // config.data = component.data || {}
    // Object.getOwnPropertyNames(Component.prototype).forEach((name) => {
    //     if (name === 'constructor') return
    //     config[name] = Component.prototype[name]
    // })

    const onLoad = config.onLoad
    const onUnload = config.onUnload
    const onReady = config.onReady
    const onShow = config.onShow
    const onHide = config.onHide
    // const onReachBottom = config.onReachBottom

    // const getter = Component.prototype.__lookupGetter__('children')
    // let children
    // if (!getter) {
    // const children = config.children
    // }

    config.children = {}

    config.add = function (child) {
        child.parent = this
        child.page = this
        this.children[child.key] = child
        if (this.loaded) {
            child.load()
        }
    }

    config.onLoad = function () {
        this.page = this
        this.isPage = true
        Events.mixTo(this)
        const setData = this.setData
        this.setData = function (data) {
            data.children = Object.assign({}, this.data.children, data.children)
            setData.call(this, data)
        }

        if (onLoad) {
            /* eslint-disable */
            onLoad.apply(this, arguments)
            /* eslint-enable */
        }

        const children = this.children

        if (children) {
            load.call(this, children)
        }
        this.loaded = true
        this.trigger('load')
    }

    config.onUnload = function () {
        const children = this.children
        Object.keys(children).forEach((key) => {
            children[key].unload()
        })
        if (onUnload) {
            /* eslint-disable */
            onUnload.apply(this, arguments)
            /* eslint-enable */
        }
    }

    config.onReady = function () {
        if (onReady) {
            /* eslint-disable */
            onReady.apply(this, arguments)
            /* eslint-enable */
        }

        const children = this.children
        Object.keys(children).forEach((key) => {
            children[key].ready()
        })

        this.trigger('ready')
    }

    config.onShow = function () {
        this.shown = true
        const children = this.children
        Object.keys(children).forEach((key) => {
            children[key].show()
        })
        if (onShow) {
            /* eslint-disable */
            onShow.apply(this, arguments)
            /* eslint-enable */
        }
        this.trigger('show')
    }

    config.onHide = function () {
        this.shown = false
        const children = this.children
        Object.keys(children).forEach((key) => {
            children[key].hide()
        })
        if (onHide) {
            /* eslint-disable */
            onHide.apply(this, arguments)
            /* eslint-enable */
        }
        this.trigger('hide')
    }

    return config
}

createPage.load = load

module.exports = createPage
