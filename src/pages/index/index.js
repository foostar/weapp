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
        currentTab: 0,
        loadMoreWord: '加载更多',
        scrollTop: 0,
        toView: '',
        goToTopHidden: true
    },
    onLoad() {
        const module = app.getModule()
        this.add(new Viewer('viewer', module))
        this.add(new Tabbar('tabbar'))
        console.log('取出缓存里的数据', app)
        app.getResources(module).then(resources => {
            console.log("resources",resources,module)
            this.setData({
                resources
            })
        })
        this.setData({
            tabs: app.globalData.tabs,
            module
        })
    },
    onReady() {
        const module = app.getModule()
        wx.setNavigationBarTitle({
            title: module.title
        })
    },
    switchTab(e) {
        const { index, moduleId } = e.currentTarget.dataset
        app.getResources(moduleId).then(resources => {
            this.setData({
                resources
            })
        })
        this.setData({
            currentTab: index
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
        console.log(12222242345678)
        this.setData({
            goToTopHidden: false
        })
    },
    selectTab(index) {
        const moduleId = this.data.tabs[index].moduleId
        const module = app.globalData.modules[moduleId]
        this.setData({
            module,
            tabSelected: index
        })
    },
    clickItem(e) {
        app.showPost(e.currentTarget.id)
    }
}))
