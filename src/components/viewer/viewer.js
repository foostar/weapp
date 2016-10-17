const Component = require('../../lib/component')
const SubnavTopbar = require('../subnavtopbar/subnavtopbar')

const components = {
    'subnav-subnavTopbar': SubnavTopbar
}

function Viewer(key, module) {
    Component.call(this, key)
    this.add(new components[`${module.type}-${module.style}`](`m_${module.id}`))
    this.data = {
        components: {
            'subnav-subnavTopbar': 'subnavtopbar'
        }
    }
}

Viewer.prototype = Object.create(Component.prototype)
Viewer.prototype.name = 'viewer'
Viewer.prototype.constructor = Viewer

// Viewer.prototype.handleTouch = function (event) {
//     this.parent.selectTab(Number(event.currentTarget.dataset.index))
// }

module.exports = Viewer
