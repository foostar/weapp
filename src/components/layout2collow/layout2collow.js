const Component = require('../../lib/component')

function Layout2ColLow(key, module) {
    Component.call(this, key)
    this.data = {
        componentList: module.componentList
    }
}

Layout2ColLow.prototype = Object.create(Component.prototype)
Layout2ColLow.prototype.name = 'layout2collow'
Layout2ColLow.prototype.constructor = Layout2ColLow

module.exports = Layout2ColLow
