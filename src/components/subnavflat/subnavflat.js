const Component = require('../../lib/component')

function SubnavFlat(key, module) {
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

SubnavFlat.prototype = Object.create(Component.prototype)
SubnavFlat.prototype.name = 'subnavflat'
SubnavFlat.prototype.constructor = SubnavFlat

SubnavFlat.prototype.switchTab = function (event) {
    const id = event.currentTarget.dataset.id
    this.setData({
        selected: id
    })
    this.children[`m_${id}`].load()
}

module.exports = SubnavFlat
