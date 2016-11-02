const TouchComponent = require('../../lib/touchcomponent')

function Layout2Row1Col(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

Layout2Row1Col.prototype = Object.create(TouchComponent.prototype)
Layout2Row1Col.prototype.name = 'layout2row1col'
Layout2Row1Col.prototype.constructor = Layout2Row1Col

module.exports = Layout2Row1Col
