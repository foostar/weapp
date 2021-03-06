const Component = require('../../lib/component.js')
const { checkHasScroll } = require('../../utils/util.js')

function SubnavTopbar(key, module) {
    Component.call(this, key)
    this.module = module

    this.addByModule(module.componentList[0])

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
        hasScroll: checkHasScroll(module),
        tabs
    }
}
SubnavTopbar.prototype = Object.create(Component.prototype)
SubnavTopbar.prototype.name = 'subnavtopbar'
SubnavTopbar.prototype.constructor = SubnavTopbar
SubnavTopbar.prototype.changeTap = function (event) {
    const { id, index } = event.currentTarget.dataset
    clearTimeout(this._timer)
    this.setData({
        index,
        selected: id,
        animating: true
    })
    this._timer = setTimeout(() => {
        if (!this.children[id]) {
            this.addByModule(this.module.componentList[index])
        }
        this.setData({
            animating: false
        })
    }, 300)
}

module.exports = SubnavTopbar
