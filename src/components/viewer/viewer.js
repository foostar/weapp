const Component = require('../../lib/component')
const components = require('../../lib/components')
const Module = require('../module/module')
const {requestFun} = require('../../utils/util')
/*
 *   @模块引入
 */
const SubnavTopbar = require('../subnavtopbar/subnavtopbar')
const SubnavFlat = require('../subnavflat/subnavflat')
const SubnavCustom = require('../subnavcustom/subnavcustom')
const Fullcard = require('../fullcard/fullcard')
const Discover = require('../discover/discover')   // 我的
const DiscoverCustom = require('../discovercustom/discovercustom')
const MessagelistFlat = require('../messagelistflat/messagelistflat')
const LayoutDefault = require('../layoutdefault/layoutdefault')
const LayoutLine = require('../layoutline/layoutline')
const LayoutSlider = require('../layoutslider/layoutslider')
const LayoutImage = require('../layoutimage/layoutimage')
const Layout1ColLowFixed = require('../layout1collowfixed/layout1collowfixed')
const Layout1ColSuperLow = require('../layout1colsuperlow/layout1colsuperlow')
const Layout2ColLow = require('../layout2collow/layout2collow')
const Layout3ColMid = require('../layout3colmid/layout3colmid')
const Layout3ColText = require('../layout3coltext/layout3coltext')
const Layout4Col = require('../layout4col/layout4col')
const LayoutTransparent = require('../layouttransparent/layouttransparent')
const LayoutSeparator = require('../layoutseparator/layoutseparator')
const TopiclistSimple = require('../topiclistsimple/topiclistsimple')
const ForumlistCard = require('../forumlistcard/forumlistcard')
const ForumlistSplit = require('../forumlistsplit/forumlistsplit')
const Talk = require('../talk/talk')
const CustomTagNav = require('../customtagnav/customtagnav')
const Custom = require('../custom/custom')
const NotSupport = require('../notsupport/notsupport')
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
components.type['layout-discoverCustom'] = DiscoverCustom
components.type['messagelist-flat'] = MessagelistFlat
components.type['layout-layoutDefault'] = LayoutDefault
components.type['layout-layoutLine'] = LayoutLine
components.type['layout-layoutSlider'] = LayoutSlider
components.type['layout-layoutSlider_Mid'] = LayoutSlider
components.type['layout-layoutImage'] = LayoutImage
components.type['layout-layoutOneCol_Low_Fixed'] = Layout1ColLowFixed
components.type['layout-layoutOneCol_Super_Low'] = Layout1ColSuperLow
components.type['layout-layoutTwoCol_Low'] = Layout2ColLow
components.type['layout-layoutThreeCol_Mid'] = Layout3ColMid
components.type['layout-layoutThreeColText'] = Layout3ColText
components.type['layout-layoutFourCol'] = Layout4Col
components.type['layout-layoutTransparent'] = LayoutTransparent
components.type['layout-layoutSeparator'] = LayoutSeparator
components.type['topiclistSimple-tieba'] = TopiclistSimple
components.type['topiclistSimple-flat'] = TopiclistSimple
components.type['topiclistSimple-card'] = TopiclistSimple
components.type['forumlist-card'] = ForumlistCard
components.type['forumlist-boardSplit'] = ForumlistSplit
components.type['talk-flat'] = Talk
components.type['layout-discoverCustom'] = DiscoverCustom
components.type['subnav-flat'] = CustomTagNav
components.type['custom-flat'] = Custom
components.type['not-support'] = NotSupport
components.type['newlivelist-flat'] = NotSupport

// topiclistSimple-flat

const app = getApp()

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
        hasScroll: checkHasScroll(module)
    }
}

Viewer.prototype = Object.create(Component.prototype)
Viewer.prototype.name = 'viewer'
Viewer.prototype.constructor = Viewer

Viewer.prototype.nextPage = function(){
    console.log('加载下一页')
    app.event.trigger('nextPage')
}

module.exports = Viewer
