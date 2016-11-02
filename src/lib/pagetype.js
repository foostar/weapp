/*
            'empty' // 无
            'moduleRef' // 选择页面
            'forumlist' // 社区版块列表
            'newslist' // 高级内容列表
            'topiclistSimple' // 帖子列表
            'topiclistComplex' // 复杂帖子列表
            'postlist' // 帖子详情
            'newsview' // 文章详情
            'webapp' // 外部URL
            'plugin' // 插件
            'mall' // 微商城
            'userinfo' // 用户中心
            'userlist' // 用户列表
            'messagelist' // 消息列表
            'setting' // 设置
            'search' // 搜索
            'fasttext' // 发表文字
            'fastimage' // 发表图片
            'fastcamera' // 发表拍照
            'fastaudio' // 发表语音
            'sign' // 签到
            'scan' // 二维码扫描
            'newlivelist' // 直播间
            'configSwitch' // 配置切换
            'talk' // 话题列表
            'talkPostList' // 话题帖子列表
         */
const pagetype = [
    { type: 'webapp', desc: '外部URL', isAchieve: false },
    { type: 'plugin', desc: 'plugin', isAchieve: false },
    { type: 'userinfo', desc: '用户中心', isAchieve: true },
    { type: 'userlist', desc: '用户列表', isAchieve: true },
    { type: 'messagelist', desc: '消息列表', isAchieve: true },
    { type: 'mall', desc: '微商城', isAchieve: false },
    { type: 'setting', desc: '设置', isAchieve: true },
    { type: 'search', desc: '搜索', isAchieve: false },
    { type: 'fasttext', desc: '发表文字', isAchieve: true },
    { type: 'fastimage', desc: '发表图片', isAchieve: true },
    { type: 'fastcamera', desc: '发表拍照', isAchieve: false },
    { type: 'fastaudio', desc: '发表语音', isAchieve: false },
    { type: 'sign', desc: '签到', isAchieve: false },
    { type: 'scan', desc: '二维码扫描', isAchieve: false },
    { type: 'newlivelist', desc: '直播间', isAchieve: false },
    { type: 'configSwitch', desc: '配置切换', isAchieve: false }
]
module.exports = pagetype
