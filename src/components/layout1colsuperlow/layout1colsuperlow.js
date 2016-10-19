const Component = require('../../lib/component')

function Layout1ColSuperLow(key, module) {
    Component.call(this, key)
    this.data = {
        componentList: module.componentList
    }
}

Layout1ColSuperLow.prototype = Object.create(Component.prototype)
Layout1ColSuperLow.prototype.name = 'layout1colsuperlow'
Layout1ColSuperLow.prototype.constructor = Layout1ColSuperLow

module.exports = Layout1ColSuperLow
