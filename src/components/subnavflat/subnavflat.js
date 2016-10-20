const Component = require('../../lib/component')

function SubnavFlat(key, module) {
    Component.call(this, key)

    this.addByModule(module.componentList)

    const modules = {}

    module.componentList.forEach((x) => {
        modules[x.id] = x
    })

    const tabs = module.componentList.map((x) => {
        return {
            id: x.id,
            title: x.title
        }
    })
    this.data = {
        index: 0,
        width: `${100 / tabs.length}%`,
        selected: module.componentList[0].id,
        modules,
        tabs
    }
}

SubnavFlat.prototype = Object.create(Component.prototype)
SubnavFlat.prototype.name = 'subnavflat'
SubnavFlat.prototype.constructor = SubnavFlat

SubnavFlat.prototype.switchTab = function (event) {
    const id = event.currentTarget.dataset.id
    const index = event.currentTarget.dataset.index
    this.setData({
        index,
        selected: id
    })
    this.children[`m_${id}`].load()
}

module.exports = SubnavFlat
