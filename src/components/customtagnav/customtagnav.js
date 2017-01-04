const Component = require('../../lib/component.js')

var app = getApp()
function CustomTagNav(key, module) {
    Component.call(this, key)
    this.addByModule(module.componentList[0])
    this.module = module
    let width = '25%'
    if (module.componentList.length < 5) {
        width = `${(100 / module.componentList.length).toFixed(2)}%`
    }
    this.data = {
        index: 0,
        selected: module.componentList[0].id,
        scrollTop: 0,
        tabs: module.componentList.map((x) => {
            return {
                id: x.id,
                title: x.title
            }
        }),
        width
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
        this.addByModule(this.module.componentList[index])
    }
    // this.children[id].load()
}

module.exports = CustomTagNav

