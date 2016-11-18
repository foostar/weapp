const Component = require('../../lib/component')
const components = require('../../lib/components')
const Module = require('../module/module')
const { checkHasScroll } = require('../../utils/util.js')
/*
 *   @模块引入
 */
const SubnavTopbar = require('../subnavtopbar/subnavtopbar')
// const SubnavFlat = require('../subnavflat/subnavflat')
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
const MyinfoAtme = require('../myinfoatme/myinfoatme')
const MyinfoPost = require('../myinfopost/myinfopost')
const MyinfoSystem = require('../myinfosystem/myinfosystem')


const UserHome = require('../user-home/user-home')
const UserList = require('../userlist/userlist')
const Topic = require('../topic/topic')


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
components.type['layout-layoutSubnavFlat'] = SubnavCard
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

const cellStyles = [ 'tieba', 'flat', 'card', 'neteaseNews', 'imageSudoku', 'circle' ]
/*
 *  @帖子列表 \ 复杂帖子列表
 */
cellStyles.forEach(x => {
    components.type[`topiclistSimple-${x}`] = TopiclistSimple
    components.type[`topiclistComplex-${x}`] = TopiclistComplex
})
/*
 *  @门户列表
 */
cellStyles.concat([ 'imageBig', 'image', 'image2' ]).forEach(x => {
    components.type[`newslist-${x}`] = NewsList
})

components.type['forumlist-flat'] = ForumlistFlat
components.type['forumlist-card'] = ForumlistCard // 卡片样式
components.type['forumlist-boardSplit'] = ForumlistSplit
components.type['talk-flat'] = Talk

components.type['subnav-flat'] = CustomTagNav   // 标签导航 目前只有 扁平样式
components.type['subnav-card'] = SubnavCard


components.type['custom-flat'] = Custom
components.type['not-support'] = NotSupport
components.type['webapp-flat'] = NotSupport
components.type['newlivelist-flat'] = NotSupport

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
components.type['myinfoatme-flat'] = MyinfoAtme  // 我的消息 @我的信息
components.type['myinfopost-flat'] = MyinfoPost  // 我的消息 【评论】
components.type['myinfosystem-flat'] = MyinfoSystem  // 系统消息

components.type['userhome-flat'] = UserHome   // 用户主页

components.type['userlist-flat'] = UserList   // 用户列表
components.type['talkPostList-flat'] = Topic
components.type['topic-flat'] = Topic         // 话题主页
components.type['talkPostList-circle'] = Topic

components.type['fastpost-flat'] = Createforum  // 快速发表暂时直接发帖
components.type['postlist-card'] = Post         // 帖子详情
components.type['postlist-flat'] = Post         // 帖子详情


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
