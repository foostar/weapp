const Component = require('../../lib/component')
const utils = require('../../utils/util.js')

function SubnavCard(key, module) {
    Component.call(this, key)
    this.module = module
    this.addByModule(module.componentList[0])
    const tabs = module.componentList.map((x) => {
        return {
            id: x.id,
            title: x.title
        }
    })
    this.data = {
        index: 0,
        width: tabs.length > 4 ? '25%' : `${100 / tabs.length}%`,
        selected: module.componentList[0].id,
        hasScroll: utils.checkHasScroll(module),
        tabs
    }
}

SubnavCard.prototype = Object.create(Component.prototype)
SubnavCard.prototype.name = 'subnavcard'
SubnavCard.prototype.constructor = SubnavCard

SubnavCard.prototype.switchTab = function (event) {
    const { id, index } = event.currentTarget.dataset
    this.setData({
        index,
        selected: id
    })
    this._timer = setTimeout(() => {
        if (!this.children[id]) {
            this.addByModule(this.module.componentList[index])
        }
    }, 300)
}

module.exports = SubnavCard
