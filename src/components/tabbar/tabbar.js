const Component = require('../../lib/component')
const CONFIG = require('../../config')

function Tabbar(key) {
    Component.call(this, key)
    this.data = {
        color: CONFIG.COLOR
    }
}

Tabbar.prototype = Object.create(Component.prototype)
Tabbar.prototype.name = 'tabbar'
Tabbar.prototype.constructor = Tabbar

Tabbar.prototype.handleTouch = function (event) {
    this.parent.selectTab(Number(event.currentTarget.dataset.index))
}

module.exports = Tabbar
