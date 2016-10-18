const Component = require('../../lib/component')
const components = require('../../lib/components')

function SubnavTopbar(key, module) {
    Component.call(this, key)

    module.componentList.forEach((m) => {
        this.add(components.create(m))
    })

    const modules = {}

    module.componentList.forEach((x) => {
        modules[x.id] = x
    })
    this.data = {
        components: components.template,
        selected: module.componentList[0].id,
        modules,
        tabs: module.componentList.map((x) => {
            return {
                id: x.id,
                title: x.title
            }
        })
    }
}

SubnavTopbar.prototype = Object.create(Component.prototype)
SubnavTopbar.prototype.name = 'subnavtopbar'
SubnavTopbar.prototype.constructor = SubnavTopbar

SubnavTopbar.prototype.changeTap = function (event) {
    const id = event.currentTarget.dataset.id
    this.setData({
        selected: id
    })
    this.children[`m_${id}`].load()
    // var self = this
    // this.setData({
    //     activeModule: self.data.module.componentList[event.target.dataset.id]
    // })
    // if (event.target.dataset.type !== 'moduleRef') {
    //     return app.getResources(event.target.dataset.id).then((resources) => {
    //         this.setData({
    //             resources,
    //             templateResources: resources,
    //             nestModule: {},
    //             isLoading: true
    //         })
    //     })
    // }
    // const getResources = app.getResources(event.target.dataset.moduleId)
    // const nestModule = app.getModule(event.target.dataset.moduleId)
    // getResources.then((resources) => {
    //     return this.setData({
    //         resources,
    //         templateResources: resources,
    //         nestModule,
    //         isLoading: true
    //     })
    // })
}

module.exports = SubnavTopbar
