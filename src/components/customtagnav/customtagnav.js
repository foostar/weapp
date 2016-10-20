const Component = require('../../lib/component')
const components = require('../../lib/components')

const app = getApp()

function CustomTagNav(key, module) {
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

CustomTagNav.prototype = Object.create(Component.prototype)
CustomTagNav.prototype.name = 'customtagnav'
CustomTagNav.prototype.constructor = CustomTagNav

CustomTagNav.prototype.changeTap = function (event) {
    console.log(event.target.dataset)
    if (!event.target.dataset.role) return
    const id = event.target.dataset.id
    this.setData({
        selected: id
    })
    this.children[`m_${id}`].load()
}

module.exports = CustomTagNav

