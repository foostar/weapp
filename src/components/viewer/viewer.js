const Component = require('../../lib/component')
const components = require('../../lib/components')
const Module = require('../module/module')
const SubnavTopbar = require('../subnavtopbar/subnavtopbar')
const Fullcard = require('../fullcard/fullcard')
const Discover = require('../discover/discover')   // 我的
const DiscoverCustom = require('../discovercustom/discovercustom') 
const MessagelistFlat = require('../messagelistflat/messagelistflat')

components.type['moduleRef-flat'] = Module
components.type['subnav-subnavTopbar'] = SubnavTopbar
components.type['full-card'] = Fullcard
components.type['full-flat'] = Fullcard
components.type['discover-flat'] = Discover
components.type['layout-discoverCustom'] = DiscoverCustom
components.type['messagelist-flat'] = MessagelistFlat

components.template['subnav-subnavTopbar'] = 'subnavtopbar'
components.template['moduleRef-flat'] = 'module'
components.template['full-card'] = 'fullcard'
components.template['full-flat'] = 'fullcard'
components.template['discover-flat'] = 'discover'
components.template['layout-discoverCustom'] = 'discovercustom'
components.template['messagelist-flat'] = 'messagelistflat'


function Viewer(key, module) {
    Component.call(this, key)
    this.module = module
    console.log(module)
    this.add(components.create(module))
    this.data = {
        components: components.template
    }
}

Viewer.prototype = Object.create(Component.prototype)
Viewer.prototype.name = 'viewer'
Viewer.prototype.constructor = Viewer

module.exports = Viewer
