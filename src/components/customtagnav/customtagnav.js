const Component = require('../../lib/component')

function CustomTagNav(key, module) {
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

CustomTagNav.prototype = Object.create(Component.prototype)
CustomTagNav.prototype.name = 'customtagnav'
CustomTagNav.prototype.constructor = CustomTagNav

CustomTagNav.prototype.changeTap = function (event) {
    if (!event.target.dataset.role) return
    const id = event.target.dataset.id
    this.setData({
        selected: id
    })
    this.children[`m_${id}`].load()
}

module.exports = CustomTagNav

