const TouchComponent = require('../../lib/touchcomponent')

function Layout4Col(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

Layout4Col.prototype = Object.create(TouchComponent.prototype)
Layout4Col.prototype.name = 'layout4col'
Layout4Col.prototype.constructor = Layout4Col

module.exports = Layout4Col
