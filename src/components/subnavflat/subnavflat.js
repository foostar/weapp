const Component = require('../../lib/component.js')

function SubnavFlat(key, module) {
    Component.call(this, key)
    this.module = module

    this.addByModule(module.componentList[0])
    console.log(module.componentList)
    const tabs = module.componentList.map((x) => {
        return {
            id: x.id,
            title: x.title
        }
    })
    let width = '25%'
    if (tabs.length < 4) {
        width = `${(100 / tabs.length).toFixed(2)}%`
    }
    this.data = {
        index: 0,
        width,
        selected: module.componentList[0].id,
        tabs
    }
}

SubnavFlat.prototype = Object.create(Component.prototype)
SubnavFlat.prototype.name = 'subnavflat'
SubnavFlat.prototype.constructor = SubnavFlat

SubnavFlat.prototype.switchTab = function (event) {
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

module.exports = SubnavFlat
