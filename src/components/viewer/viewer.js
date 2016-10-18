const Component = require('../../lib/component')
const components = require('../../lib/components')
const Module = require('../module/module')
const SubnavTopbar = require('../subnavtopbar/subnavtopbar')
const SubnavFlat = require('../subnavflat/subnavflat')
const SubnavCustom = require('../subnavcustom/subnavcustom')
const Fullcard = require('../fullcard/fullcard')
const Discover = require('../discover/discover')
const LayoutDefault = require('../layoutdefault/layoutdefault')
const LayoutSlider = require('../layoutslider/layoutslider')
const Layout1ColLowFixed = require('../layout1collowfixed/layout1collowfixed')
const Layout3ColText = require('../layout3coltext/layout3coltext')
const Layout4Col = require('../layout4col/layout4col')
const LayoutTransparent = require('../layouttransparent/layouttransparent')
const LayoutSeparator = require('../layoutseparator/layoutseparator')
const TopiclistSimple = require('../topiclistsimple/topiclistsimple')
const ForumlistCard = require('../forumlistcard/forumlistcard')
const ForumlistSplit = require('../forumlistsplit/forumlistsplit')
const Talk = require('../talk/talk')

components.type['moduleRef-flat'] = Module
components.type['subnav-subnavTopbar'] = SubnavTopbar
components.type['layout-layoutSubnavFlat'] = SubnavFlat
components.type['customSubnav-flat'] = SubnavCustom
components.type['full-card'] = Fullcard
components.type['full-flat'] = Fullcard
components.type['discover-flat'] = Discover
components.type['layout-layoutDefault'] = LayoutDefault
components.type['layout-layoutSlider'] = LayoutSlider
components.type['layout-layoutOneCol_Low_Fixed'] = Layout1ColLowFixed
components.type['layout-layoutThreeColText'] = Layout3ColText
components.type['layout-layoutFourCol'] = Layout4Col
components.type['layout-layoutTransparent'] = LayoutTransparent
components.type['layout-layoutSeparator'] = LayoutSeparator
components.type['topiclistSimple-tieba'] = TopiclistSimple
components.type['topiclistSimple-flat'] = TopiclistSimple
components.type['forumlist-card'] = ForumlistCard
components.type['forumlist-boardSplit'] = ForumlistSplit
components.type['talk-flat'] = Talk

components.template['subnav-subnavTopbar'] = 'subnavtopbar'
components.template['layout-layoutSubnavFlat'] = 'subnavflat'
components.template['customSubnav-flat'] = 'subnavcustom'
components.template['moduleRef-flat'] = 'module'
components.template['full-card'] = 'fullcard'
components.template['full-flat'] = 'fullcard'
components.template['discover-flat'] = 'discover'
components.template['layout-layoutDefault'] = 'layoutdefault'
components.template['layout-layoutSlider'] = 'layoutslider'
components.template['layout-layoutOneCol_Low_Fixed'] = 'layout1collowfixed'
components.template['layout-layoutThreeColText'] = 'layout3coltext'
components.template['layout-layoutFourCol'] = 'layout4col'
components.template['layout-layoutTransparent'] = 'layouttransparent'
components.template['layout-layoutSeparator'] = 'layoutseparator'
components.template['topiclistSimple-tieba'] = 'topiclistsimple'
components.template['topiclistSimple-flat'] = 'topiclistsimple'
components.template['forumlist-card'] = 'forumlistcard'
components.template['forumlist-boardSplit'] = 'forumlistsplit'
components.template['talk-flat'] = 'talk'
// topiclistSimple-flat

const checkHasScroll = (module) => {
    if (module.type === 'subnav') {
        return true
    }
    return module.componentList.map(checkHasScroll).some(x => x)
}

function Viewer(key, module) {
    Component.call(this, key)
    this.module = module
    this.add(components.create(module))
    this.data = {
        hasScroll: checkHasScroll(module),
        components: components.template
    }
}

Viewer.prototype = Object.create(Component.prototype)
Viewer.prototype.name = 'viewer'
Viewer.prototype.constructor = Viewer

module.exports = Viewer
