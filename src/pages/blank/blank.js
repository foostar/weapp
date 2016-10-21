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
        golbalFetch: true
    },
    onLoad(data) {
        var self = this
        const { moduleId } = data // 存导航栏标题, onReady 再设置
        const module = app.globalData.modules[moduleId]
        this.add(new Viewer('viewer', module))
        this.setData({
            module,
            appIcon: app.globalData.info.appIcon,
            appColor: app.globalData.info.appColor
        })
        app.event.on('golbal-fetching', () => {
            self.setData({
                golbalFetch: false
            })
        })
        app.event.on('golbal-done', () => {
            self.setData({
                golbalFetch: true
            })
        })
    },
    onReady() {
    },
    goToTop() {
        this.setData({
            // scrollTop:    0
            toView: 'top'
        })
    },
    clickItem(e) {
        app.showPost(e.currentTarget.id)
    }
}))
