const TouchComponent = require('../../lib/touchcomponent')

function LayoutColText(key, module) {
    TouchComponent.call(this, key, module)
    this.data = {
        style: module.style,
        componentList: module.componentList
    }
}

LayoutColText.prototype = Object.create(TouchComponent.prototype)
LayoutColText.prototype.name = 'layoutcoltext'
LayoutColText.prototype.constructor = LayoutColText

module.exports = LayoutColText
