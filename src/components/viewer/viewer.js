const Component = require('../../lib/component.js')
const components = require('../../lib/components.js')
const Module = require('../module/module.js')
const { checkHasScroll } = require('../../utils/util.js')

/*
 *   @模块引入
 */
const SubnavTopbar = require('../subnavtopbar/subnavtopbar.js')
// const SubnavFlat = require('../subnavflat/subnavflat')
const SubnavCard = require('../subnavcard/subnavcard.js')

const SubnavCustom = require('../subnavcustom/subnavcustom.js')
const Fullcard = require('../fullcard/fullcard.js')
const Discover = require('../discover/discover.js')   // 我的
const DiscoverCustom = require('../discovercustom/discovercustom.js')
const MessagelistFlat = require('../messagelistflat/messagelistflat.js')
const LayoutDefault = require('../layoutdefault/layoutdefault.js')
const LayoutLine = require('../layoutline/layoutline.js')
const LayoutImage = require('../layoutimage/layoutimage.js')
const LayoutSlider = require('../layoutslider/layoutslider.js')
const Layout1Col = require('../layout1col/layout1col.js')
const Layout2Col = require('../layout2col/layout2col.js')
const Layout3Col = require('../layout3col/layout3col.js')
const Layout4Col = require('../layout4col/layout4col.js')
const LayoutColText = require('../layoutcoltext/layoutcoltext.js')
const Layout1Col1Row = require('../layout1col1row/layout1col1row.js')
const Layout1Col2Row = require('../layout1col2row/layout1col2row.js')
const Layout1Col3Row = require('../layout1col3row/layout1col3row.js')
const Layout1Row1Col = require('../layout1row1col/layout1row1col.js')
const Layout2Row1Col = require('../layout2row1col/layout2row1col.js')
const Layout3Row1Col = require('../layout3row1col/layout3row1col.js')
const LayoutTransparent = require('../layouttransparent/layouttransparent.js')
const LayoutSeparator = require('../layoutseparator/layoutseparator.js')
const LayoutNewsAuto = require('../layoutnewsauto/layoutnewsauto.js')
const TopiclistSimple = require('../topiclistsimple/topiclistsimple.js')
const TopiclistComplex = require('../topiclistcomplex/topiclistcomplex.js')
const ForumlistCard = require('../forumlistcard/forumlistcard.js')
const ForumlistFlat = require('../forumlistflat/forumlistflat.js')

const ForumlistSplit = require('../forumlistsplit/forumlistsplit.js')
const Talk = require('../talk/talk.js')
const CustomTagNav = require('../customtagnav/customtagnav.js')
const Custom = require('../custom/custom.js')
const NotSupport = require('../notsupport/notsupport.js')
const NewsList = require('../newslist/newslist.js')
const Post = require('../post/post.js')
// 固定页面
const Login = require('../login/login.js')
const PreLogin = require('../prelogin/prelogin.js')
const Mylistcompos = require('../mylistcompos/mylistcompos.js')
// const Createforum = require('../createforum/createforum.js')
const About = require('../about/about.js')
const Setting = require('../setting/setting.js')
const Changepassword = require('../changepassword/changepassword.js')
const Register = require('../register/register.js')
const Myinfo = require('../myinfo/myinfo.js')
const MyinfoAtme = require('../myinfoatme/myinfoatme.js')
const MyinfoPost = require('../myinfopost/myinfopost.js')
const MyinfoSystem = require('../myinfosystem/myinfosystem.js')
const Search = require('../search/search.js')
const Stickmore = require('../stickmore/stickmore.js')
const UserHome = require('../user-home/user-home.js')
const UserList = require('../userlist/userlist.js')
const Topic = require('../topic/topic.js')

const FollowList = require('../followlist/followlist.js')
const VerifyMobile = require('../verifymobile/verifymobile.js')
const Forgot = require('../forgotpassword/forgotpassword.js')
const Sign = require('../sign/sign.js')


const OldCreateForum = require('../oldcreateforum/oldcreateforum.js')

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

components.type['newslist-flat'] = NewsList // 门户列表


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
// 之前的登陆页面
components.type['oldlogin-flat'] = Login   // 登录页面
// 在登陆之前判断 以何种方式登陆
components.type['login-flat'] = PreLogin   // 登录页面

components.type['mylistcompos-flat'] = Mylistcompos // 我的好友、发表、收藏列表
components.type['about-flat'] = About    // 关于app
components.type['setting-flat'] = Setting  // 设置
components.type['notsupport-flat'] = NotSupport   // 固定页面不支持功能
components.type['changepassword-flat'] = Changepassword  // 修改密码
components.type['register-flat'] = Register   // 注册页面
components.type['myinfo-flat'] = Myinfo       // 我的消息
components.type['myinfoatme-flat'] = MyinfoAtme  // 我的消息 @我的信息
components.type['myinfopost-flat'] = MyinfoPost  // 我的消息 【评论】
components.type['myinfosystem-flat'] = MyinfoSystem  // 系统消息
components.type['search-flat'] = Search    // 搜索帖子/文章/用户
components.type['verifymobile-flat'] = VerifyMobile // 登录校验用户


components.type['userhome-flat'] = UserHome   // 用户主页
components.type['userinfo-flat'] = Discover  // 用户中心


components.type['userlist-flat'] = UserList   // 用户列表
components.type['talkPostList-flat'] = Topic
components.type['topic-flat'] = Topic         // 话题主页
components.type['talkPostList-circle'] = Topic


/*  发帖内容  */
components.type['fastpost-flat'] = OldCreateForum  // 快速发表暂时直接发帖
components.type['fasttext-flat'] = OldCreateForum // 快速发表
components.type['fastimage-flat'] = OldCreateForum // 图片发表
components.type['fastimage-flat'] = OldCreateForum // 图片发表
components.type['fastpost-card'] = OldCreateForum  // 快速发表暂时直接发帖
components.type['fasttext-card'] = OldCreateForum // 快速发表
components.type['fastimage-card'] = OldCreateForum // 图片发表
components.type['fastimage-card'] = OldCreateForum // 图片发表
components.type['createforum-flat'] = OldCreateForum    // 发帖组件


components.type['postlist-card'] = Post         // 帖子详情
components.type['postlist-flat'] = Post         // 帖子详情

components.type['followlist-flat'] = FollowList  // 关注相关列表
components.type['stickmore-flat'] = Stickmore   // 更多列表

components.type['forgot-flat'] = Forgot      // 忘记密码
components.type['sign-flat'] = Sign          // 用户签到

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
        isShow: false,
        errMessage: ''
    }
}

Viewer.prototype = Object.create(Component.prototype)
Viewer.prototype.name = 'viewer'
Viewer.prototype.constructor = Viewer
Viewer.prototype.onLoad = function () {
    app.event.on('errormessage', (value) => {
        this.setData({
            isShow: true,
            errMessage: value
        })
        this.closeMessagePrompt()
    })
}
Viewer.prototype.nextPage = function () {
    app.event.trigger('nextPage')
}
// 关闭页面提示信息
Viewer.prototype.closeMessagePrompt = function () {
    clearTimeout(this._errMsg)
    this._errMsg = setTimeout(() => {
        this.setData({
            isShow: false,
            errMessage: ''
        })
    }, 1500)
}


module.exports = Viewer
