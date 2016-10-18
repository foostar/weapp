const Component = require('../../lib/component')

function LayoutSeparator(key) {
    Component.call(this, key)
}

LayoutSeparator.prototype = Object.create(Component.prototype)
LayoutSeparator.prototype.name = 'tabbar'
LayoutSeparator.prototype.constructor = LayoutSeparator

module.exports = LayoutSeparator
