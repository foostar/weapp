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
                    component[name].apply(component, arguments)
                }
            })
    })
    Object.keys(children).forEach((key) => {
        const component = children[key]
        if (component.children) {
            bindHandlers(page, component.children)
        }
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

    // const getter = Component.prototype.__lookupGetter__('children')
    // let children
    // if (!getter) {
    // const children = config.children
    // }

    config.children = {}

    config.add = function (child) {
        child.parent = this
        this.children[child.key] = child
    }

    config.onLoad = function () {
    //     var me = this
    //     me.onLoad = function () {
    //     }
    //     me.props = {}
    //     if (getter) {
    //         children = getter.call(me)
    //     }

    //     Object.defineProperty(me, 'children', {
    //         value: children
    //     })

    //     const setData = me.setData

    //     /**
    //      * 设置模板数据
    //      * @param {object|string} data
    //      * @param {object} [value]
    //      */
    //     me.setData = function (data, value) {
    //         if (typeof data === 'string') {
    //             const tmp = {}
    //             tmp[data] = value
    //             data = tmp
    //         }

    //         setData.call(me, data)

    //         if (!children) return
    //         // 需要用到更新的数据key列表
    //         const updatedKeys = []
    //         Object.keys(data).forEach((k) => {
    //             if (me._refs[k]) {
    //                 updatedKeys.push(k)
    //             }
    //         })
    //         // console.log('updatedKeys', updatedKeys, this);
    //         if (!updatedKeys.length) return

    //         const datas = {}
    //         updatedKeys.forEach((k) => {
    //             me._refs[k].forEach((arr) => {
    //                 var com = arr[1]
    //                 if (!datas[com.key]) {
    //                     datas[com.key] = {}
    //                 }
    //                 datas[com.key][arr[0]] = data[k]
    //             })
    //         })

    //         // console.log('datas', datas);
    //         Object.keys(datas).forEach((k) => {
    //             var com = children[k]
    //             var d = Object.assign({}, com.props, datas[k])
    //             if (com.onUpdate) {
    //                 com.onUpdate(d)
    //             }
    //             com.props = d
    //         })
    //     }

        if (onLoad) {
            onLoad.apply(this, arguments)
        }

        const children = this.children

        if (children) {
    //         me._refs = {}

    //         me._registerRef = function (ref, prop, component) {
    //             if (!me._refs[ref]) {
    //                 me._refs[ref] = []
    //             }
    //             me._refs[ref].push([prop, component])
    //         }
            const data = {}
            Object.keys(children).forEach((key) => {
                const component = children[key]
                data[key] = component.data
            })

    //         // 递归绑定子控件事件方法
            bindHandlers(this, children)

            this.setData({ children: data })

    //         // 优化性能
    //         const existFn = []
    //         const allFn = [ 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefreash' ]
    //         Object.keys(children).forEach((key) => {
    //             const component = children[key]
    //             if (component.onLoad) {
    //                 component.onLoad()
    //             }

    //             allFn.forEach((name) => {
    //                 if (existFn.indexOf(name) === -1 && component[name]) {
    //                     existFn.push(name)
    //                 }
    //             })
    //         })

    //         existFn.forEach((name) => {
    //             var func = me[name]
    //             me[name] = function () {
    //                 Object.keys(children).forEach(function (k) {
    //                     const component = children[k]
    //                     if (component[name]) {
    //                         component[name].apply(component, arguments)
    //                     }
    //                 })
    //                 if (func) {
    //                     func.apply(this, arguments)
    //                 }
    //             }
    //         })
        }

    } // end of onLoad

    return config
}

module.exports = createPage
