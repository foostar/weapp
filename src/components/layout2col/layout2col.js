const TouchComponent = require('../../lib/touchcomponent')

function Layout2Col(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

Layout2Col.prototype = Object.create(TouchComponent.prototype)
Layout2Col.prototype.name = 'layout2col'
Layout2Col.prototype.constructor = Layout2Col

module.exports = Layout2Col
