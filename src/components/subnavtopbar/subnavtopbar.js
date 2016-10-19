const Component = require('../../lib/component')

function SubnavTopbar(key, module) {
    Component.call(this, key)

    this.addByModule(module.componentList)

    const modules = {}

    module.componentList.forEach((x) => {
        modules[x.id] = x
    })

    this.data = {
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
}

module.exports = SubnavTopbar
