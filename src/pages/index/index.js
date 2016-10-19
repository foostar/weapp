const createPage = require('../../lib/createpage.js')
const Viewer = require('../../components/viewer/viewer')
const Tabbar = require('../../components/tabbar/tabbar')
var app = getApp()

Page(createPage({
    data: {
        tabs: [],
        tabSelected: 0,
        module: null,
        resources: {},
        loadMoreWord: '加载更多',
        scrollTop: 0,
        toView: '',
        goToTopHidden: true
    },
    onLoad() {
        const module = app.getModule()
        this.add(new Viewer('viewer', module))
        this.add(new Tabbar('tabbar'))

        let tabSelected = 0
        app.globalData.tabs.forEach((item, index) => {
            if (item.moduleId === module.id) {
                tabSelected = index
            }
        })
        this.setData({
            tabs: app.globalData.tabs,
            module,
            tabSelected
        })
    },
    onReady() {
        const module = app.getModule()
        wx.setNavigationBarTitle({
            title: module.title
        })
    },
    goToTop() {
        console.log('触发 scrolltoupper 事件')
        this.setData({
            // scrollTop:    0
            toView: 'top'
        })
    },
    scrolltoupper() {
        this.setData({
            goToTopHidden: false
        })
    },
    selectTab(index) {
        const moduleId = this.data.tabs[index].moduleId
        if (moduleId === this.data.module.id) return
        const module = app.globalData.modules[moduleId]
        this.add(new Viewer('viewer', module))
        this.setData({
            module,
            tabSelected: index
        })
    },
    clickItem(e) {
        app.showPost(e.currentTarget.id)
    }
}))
