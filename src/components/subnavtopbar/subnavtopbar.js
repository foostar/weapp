const Component = require('../../lib/component')

function SubnavTopbar(key) {
    Component.call(this, key)
}

SubnavTopbar.prototype = Object.create(Component.prototype)
SubnavTopbar.prototype.name = 'subnavtopbar'
SubnavTopbar.prototype.constructor = SubnavTopbar

// SubnavTopbar.prototype.handleTouch = function (event) {
//     this.parent.selectTab(Number(event.currentTarget.dataset.index))
// }

module.exports = SubnavTopbar
