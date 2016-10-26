const createPage = require('../../lib/createpage.js')
const Viewer = require('../../components/viewer/viewer')
const Tabbar = require('../../components/tabbar/tabbar')

var app = getApp()

Page(createPage({
    data: {
        tabs: [],
        tabSelected: 0,
        module: null,
        golbalFetch: true
    },
    onLoad() {
        let self = this
        let tabSelected = 0
        const { modules, tabs } = app.globalData
        const module = modules[tabs[tabSelected].moduleId]
        this.add(new Viewer('viewer', module))
        this.add(new Tabbar('tabbar'))
        app.globalData.tabs.forEach((item, index) => {
            if (item.moduleId === module.id) {
                tabSelected = index
            }
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
        this.setData({
            tabs: app.globalData.tabs,
            module,
            tabSelected
        })
    },
    onReady() {
        wx.setNavigationBarTitle({
            title: this.data.module.title
        })
    },
    selectTab(index) {
        const { modules, tabs } = app.globalData
        const moduleId = tabs[index].moduleId
        if (moduleId === this.data.module.id) return
        const module = modules[moduleId]
        this.add(new Viewer('viewer', module))
        this.setData({
            module,
            tabSelected: index
        })
    },
    clickItem(e) {
        if (!e.currentTarget.role) {
            return app.showPost(e.currentTarget.id)
        }
    }
}))
