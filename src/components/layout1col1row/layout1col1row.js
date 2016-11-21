const TouchComponent = require('../../lib/touchcomponent.js')

function Layout1Col1Row(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

Layout1Col1Row.prototype = Object.create(TouchComponent.prototype)
Layout1Col1Row.prototype.name = 'layout1col1row'
Layout1Col1Row.prototype.constructor = Layout1Col1Row

module.exports = Layout1Col1Row
