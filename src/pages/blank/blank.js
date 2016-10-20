const createPage = require('../../lib/createpage.js')
const Viewer = require('../../components/viewer/viewer')

var app = getApp()
Page(createPage({
    data: {
        userinfo: {},
        module: null,
        resources: {},
        title: '',
        toView: '',
        isLoading: false,
        appIcon: '',
        appColor: '',
    },
    onLoad(data) {
        const { moduleId } = data // 存导航栏标题, onReady 再设置
        const module = app.getModule(moduleId)
        const { title } = module
        this.add(new Viewer('viewer', module))
        this.setData({
            module,
            title,
            appIcon: app.globalData.info.appIcon,
            appColor: app.globalData.info.appColor
        })
    },
    onReady() {
        var self = this
        wx.setNavigationBarTitle({
            title: self.data.title
        })
    },
    goToTop() {
        console.log('触发 scrolltoupper 事件')
        this.setData({
            // scrollTop:    0
            toView: 'top'
        })
    }
}))
