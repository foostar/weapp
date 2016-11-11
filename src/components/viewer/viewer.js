const Component = require('../../lib/component')
const components = require('../../lib/components')
const Module = require('../module/module')
const { checkHasScroll } = require('../../utils/util.js')
/*
 *   @模块引入
 */
const SubnavTopbar = require('../subnavtopbar/subnavtopbar')
const SubnavFlat = require('../subnavflat/subnavflat')
const SubnavCard = require('../subnavcard/subnavcard')


const SubnavCustom = require('../subnavcustom/subnavcustom')
const Fullcard = require('../fullcard/fullcard')
const Discover = require('../discover/discover')   // 我的
const DiscoverCustom = require('../discovercustom/discovercustom')
const MessagelistFlat = require('../messagelistflat/messagelistflat')
const LayoutDefault = require('../layoutdefault/layoutdefault')
const LayoutLine = require('../layoutline/layoutline')
const LayoutImage = require('../layoutimage/layoutimage')
const LayoutSlider = require('../layoutslider/layoutslider')
const Layout1Col = require('../layout1col/layout1col')
const Layout2Col = require('../layout2col/layout2col')
const Layout3Col = require('../layout3col/layout3col')
const Layout4Col = require('../layout4col/layout4col')
const LayoutColText = require('../layoutcoltext/layoutcoltext')
const Layout1Col1Row = require('../layout1col1row/layout1col1row')
const Layout1Col2Row = require('../layout1col2row/layout1col2row')
const Layout1Col3Row = require('../layout1col3row/layout1col3row')
const Layout1Row1Col = require('../layout1row1col/layout1row1col')
const Layout2Row1Col = require('../layout2row1col/layout2row1col')
const Layout3Row1Col = require('../layout3row1col/layout3row1col')
const LayoutTransparent = require('../layouttransparent/layouttransparent')
const LayoutSeparator = require('../layoutseparator/layoutseparator')

const LayoutNewsAuto = require('../layoutnewsauto/layoutnewsauto')

const TopiclistSimple = require('../topiclistsimple/topiclistsimple')
const TopiclistComplex = require('../topiclistcomplex/topiclistcomplex')
const ForumlistCard = require('../forumlistcard/forumlistcard')
const ForumlistFlat = require('../forumlistflat/forumlistflat')

const ForumlistSplit = require('../forumlistsplit/forumlistsplit')
const Talk = require('../talk/talk')
const CustomTagNav = require('../customtagnav/customtagnav')
const Custom = require('../custom/custom')
const NotSupport = require('../notsupport/notsupport')
const NewsList = require('../newslist/newslist')
const Post = require('../post/post')
// 固定页面
const Login = require('../login/login')
const Mylistcompos = require('../mylistcompos/mylistcompos')
const Createforum = require('../createforum/createforum')
const About = require('../about/about')
const Setting = require('../setting/setting')
const Changepassword = require('../changepassword/changepassword')
const Register = require('../register/register')
const Myinfo = require('../myinfo/myinfo')
const UserHome = require('../user-home/user-home')
const UserList = require('../userlist/userlist')

/*
 *   @定义组件类型
 */

components.type['moduleRef-flat'] = Module
components.type['moduleRef-tieba'] = Module
components.type['moduleRef-card'] = Module
components.type['moduleRef-neteaseNews'] = Module
components.type['moduleRef-imageSudoku'] = Module
components.type['moduleRef-circle'] = Module
components.type['subnav-subnavTopbar'] = SubnavTopbar
components.type['layout-layoutSubnavFlat'] = SubnavFlat
components.type['customSubnav-flat'] = SubnavCustom
components.type['full-card'] = Fullcard
components.type['full-flat'] = Fullcard
components.type['discover-flat'] = Discover
components.type['layout-discoverCustom'] = DiscoverCustom
components.type['messagelist-flat'] = MessagelistFlat
// 风格区
components.type['layout-layoutDefault'] = LayoutDefault
components.type['layout-layoutLine'] = LayoutLine
components.type['layout-layoutImage'] = LayoutImage

components.type['layout-layoutSlider'] = LayoutSlider // 幻灯片样式(高)
components.type['layout-layoutSlider_Mid'] = LayoutSlider // 幻灯片样式(中)
components.type['layout-layoutSlider_Low'] = LayoutSlider // 幻灯片样式(低)

components.type['layout-layoutOneCol_High'] = Layout1Col // 单栏样式(高)
components.type['layout-layoutOneCol_Low'] = Layout1Col // 单栏样式(中)
components.type['layout-layoutOneCol_Low_Fixed'] = Layout1Col // 单栏样式(低)
components.type['layout-layoutOneCol_Super_Low'] = Layout1Col // 单栏样式(超低)

components.type['layout-layoutTwoCol_High'] = Layout2Col // 双栏样式(高)
components.type['layout-layoutTwoCol_Mid'] = Layout2Col // 双栏样式(中)
components.type['layout-layoutTwoCol_Low'] = Layout2Col // 双栏样式(低)
components.type['layout-layoutTwoCol_Super_Low'] = Layout2Col // 双栏样式(超低)

components.type['layout-layoutThreeCol_High'] = Layout3Col // 三栏样式(高)
components.type['layout-layoutThreeCol_Mid'] = Layout3Col // 三栏样式(中)
components.type['layout-layoutThreeCol_Low'] = Layout3Col // 三栏样式(低)
components.type['layout-layoutThreeCol_Super_Low'] = Layout3Col // 三栏样式(超低)

components.type['layout-layoutFourCol'] = Layout4Col // 四栏样式
components.type['layout-layoutFourCol_Super_Low'] = Layout4Col // 四栏样式(超低)

components.type['layout-layoutTwoColText'] = LayoutColText // 两栏文字
components.type['layout-layoutThreeColText'] = LayoutColText // 三栏文字

components.type['layout-layoutOneColOneRow'] = Layout1Col1Row // 1(大)+1样式
components.type['layout-layoutOneColTwoRow'] = Layout1Col2Row // 1+2样式
components.type['layout-layoutOneColThreeRow'] = Layout1Col3Row // 1+3样式

components.type['layout-layoutOneRowOneCol'] = Layout1Row1Col // 1+1(大)样式
components.type['layout-layoutTwoRowOneCol'] = Layout2Row1Col // 2+1样式
components.type['layout-layoutThreeRowOneCol'] = Layout3Row1Col // 3+1样式

components.type['layout-layoutTransparent'] = LayoutTransparent
components.type['layout-layoutSeparator'] = LayoutSeparator // 分割线

components.type['layout-layoutNewsAuto'] = LayoutNewsAuto // 列表自动样式
/*
 *  @帖子列表
 */
components.type['topiclistSimple-tieba'] = TopiclistSimple
components.type['topiclistSimple-flat'] = TopiclistSimple
components.type['topiclistSimple-card'] = TopiclistSimple
components.type['topiclistSimple-neteaseNews'] = TopiclistSimple
components.type['topiclistSimple-imageSudoku'] = TopiclistSimple
components.type['topiclistSimple-circle'] = TopiclistSimple
/*
 *  @复杂帖子列表、门户主页
 */
components.type['topiclistComplex-flat'] = TopiclistComplex
components.type['topiclistComplex-tieba'] = TopiclistComplex
components.type['topiclistComplex-card'] = TopiclistComplex
components.type['topiclistComplex-neteaseNews'] = TopiclistComplex
components.type['topiclistComplex-imageSudoku'] = TopiclistComplex
components.type['topiclistComplex-circle'] = TopiclistComplex
/*
 *  @门户列表
 */
components.type['newslist-tieba'] = NewsList
components.type['newslist-flat'] = NewsList
components.type['newslist-card'] = NewsList
components.type['newslist-neteaseNews'] = NewsList
components.type['newslist-imageSudoku'] = NewsList
components.type['newslist-circle'] = NewsList
components.type['newslist-imageBig'] = NewsList
components.type['newslist-image'] = NewsList // 图片1
components.type['newslist-image2'] = NewsList // 图片2

components.type['forumlist-flat'] = ForumlistFlat
components.type['forumlist-card'] = ForumlistCard // 卡片样式
components.type['forumlist-boardSplit'] = ForumlistSplit
components.type['talk-flat'] = Talk

components.type['subnav-flat'] = CustomTagNav   // 标签导航 目前只有 扁平样式
components.type['subnav-card'] = SubnavCard


components.type['custom-flat'] = Custom
components.type['not-support'] = NotSupport
components.type['webapp-flat'] = NotSupport

components.type['post-flat'] = Post
components.type['login-flat'] = Login   // 登录页面
components.type['mylistcompos-flat'] = Mylistcompos // 我的好友、发表、收藏列表
components.type['createforum-flat'] = Createforum    // 发帖组件
components.type['about-flat'] = About    // 关于app
components.type['setting-flat'] = Setting  // 设置
components.type['notsupport-flat'] = NotSupport   // 固定页面不支持功能
components.type['changepassword-flat'] = Changepassword  // 修改密码
components.type['register-flat'] = Register   // 注册页面
components.type['myinfo-flat'] = Myinfo       // 我的消息
components.type['userhome-flat'] = UserHome   // 用户主页

components.type['userlist-flat'] = UserList   // 用户列表

// topiclistSimple-flat

const app = getApp()

function Viewer(key, module) {
    Component.call(this, key)
    this.module = module
    this.add(components.create(module))
    this.data = {
        name: app.config.NAME,
        moduleId: module.id,
        hasScroll: checkHasScroll(module),
    }
}
Viewer.prototype = Object.create(Component.prototype)
Viewer.prototype.name = 'viewer'
Viewer.prototype.constructor = Viewer
Viewer.prototype.nextPage = function () {
    app.event.trigger('nextPage')
}

module.exports = Viewer
