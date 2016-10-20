const Component = require('../../lib/component')
const components = require('../../lib/components')
const Module = require('../module/module')
/*
 *   @模块引入
 */
const SubnavTopbar = require('../subnavtopbar/subnavtopbar')
const SubnavFlat = require('../subnavflat/subnavflat')
const SubnavCustom = require('../subnavcustom/subnavcustom')
const Fullcard = require('../fullcard/fullcard')
const Discover = require('../discover/discover')
const LayoutDefault = require('../layoutdefault/layoutdefault')
const LayoutSlider = require('../layoutslider/layoutslider')
const LayoutFourCol = require('../layoutfourcol/layoutfourcol')
const LayoutTransparent = require('../layouttransparent/layouttransparent')
const TopiclistSimple = require('../topiclistsimple/topiclistsimple')
const ForumlistCard = require('../forumlistcard/forumlistcard')
const ForumlistSplit = require('../forumlistsplit/forumlistsplit')
const Talk = require('../talk/talk')
const DiscoverCustom = require('../discovercustom/discovercustom')
const CustomTagNav = require('../customtagnav/customtagnav')
/*
 *   @定义组件类型
 */

components.type['moduleRef-flat'] = Module
components.type['subnav-subnavTopbar'] = SubnavTopbar
components.type['layout-layoutSubnavFlat'] = SubnavFlat
components.type['customSubnav-flat'] = SubnavCustom
components.type['full-card'] = Fullcard
components.type['full-flat'] = Fullcard
components.type['discover-flat'] = Discover
components.type['layout-layoutDefault'] = LayoutDefault
components.type['layout-layoutSlider'] = LayoutSlider
components.type['layout-layoutFourCol'] = LayoutFourCol
components.type['layout-layoutTransparent'] = LayoutTransparent
components.type['topiclistSimple-tieba'] = TopiclistSimple
components.type['topiclistSimple-flat'] = TopiclistSimple
components.type['forumlist-card'] = ForumlistCard
components.type['forumlist-boardSplit'] = ForumlistSplit
components.type['talk-flat'] = Talk
components.type['layout-discoverCustom'] = DiscoverCustom
components.type['subnav-flat'] = CustomTagNav
/*
 *   @定义组件模板
 */
components.template['subnav-subnavTopbar'] = 'subnavtopbar'
components.template['layout-layoutSubnavFlat'] = 'subnavflat'
components.template['customSubnav-flat'] = 'subnavcustom'
components.template['moduleRef-flat'] = 'module'
components.template['full-card'] = 'fullcard'
components.template['full-flat'] = 'fullcard'
components.template['discover-flat'] = 'discover'
components.template['layout-layoutDefault'] = 'layoutdefault'
components.template['layout-layoutSlider'] = 'layoutslider'
components.template['layout-layoutFourCol'] = 'layoutfourcol'
components.template['layout-layoutTransparent'] = 'layouttransparent'
components.template['topiclistSimple-tieba'] = 'topiclistsimple'
components.template['topiclistSimple-flat'] = 'topiclistsimple'
components.template['forumlist-card'] = 'forumlistcard'
components.template['forumlist-boardSplit'] = 'forumlistsplit'
components.template['talk-flat'] = 'talk'
components.template['layout-discoverCustom'] = 'discovercustom'
components.template['subnav-flat'] = 'customtagnav'
/*
 *   @视图层注册机
 */

function Viewer(key, module) {
    Component.call(this, key)
    this.module = module
    this.add(components.create(module))
    this.data = {
        components: components.template
    }
}

Viewer.prototype = Object.create(Component.prototype)
Viewer.prototype.name = 'viewer'
Viewer.prototype.constructor = Viewer

module.exports = Viewer
