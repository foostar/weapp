const TouchComponent = require('../../lib/touchcomponent.js')

function Layout1Col2Row(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

Layout1Col2Row.prototype = Object.create(TouchComponent.prototype)
Layout1Col2Row.prototype.name = 'layout1col2row'
Layout1Col2Row.prototype.constructor = Layout1Col2Row

module.exports = Layout1Col2Row
