const Component = require('../../lib/component')

var app = getApp()
function CustomTagNav(key, module) {
    Component.call(this, key)
    this.addByModule(module.componentList[0])

    const modules = {}
    module.componentList.forEach((x) => {
        modules[x.id] = x
    })
    this.data = {
        index: 0,
        selected: module.componentList[0].id,
        modules,
        module,
        scrollTop: 0,
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
CustomTagNav.prototype.nextPage = function () {
    app.event.trigger('nextPage')
}
CustomTagNav.prototype.changeTap = function (event) {
    if (!event.target.dataset.role) return
    const { id, index } = event.target.dataset
    this.setData({
        selected: id,
        index,
        scrollTop: 0
    })
    if (!this.children[id]) {
        this.addByModule(this.data.module.componentList[index])
    }
    // this.children[id].load()
}

module.exports = CustomTagNav

