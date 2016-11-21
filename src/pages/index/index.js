const createPage = require('../../lib/createpage.js')
const Viewer = require('../../components/viewer/viewer.js')
const Tabbar = require('../../components/tabbar/tabbar.js')

var app = getApp()

Page(createPage({
    data: {
        tabs: [],
        tabSelected: 0
    },
    onLoad() {
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
        this.module = module
        this.setData({
            tabs: app.globalData.tabs,
            tabSelected
        })
    },
    onReady() {
        wx.setNavigationBarTitle({
            title: this.module.title
        })
    },
    selectTab(index) {
        const { modules, tabs } = app.globalData
        const moduleId = tabs[index].moduleId
        if (moduleId === this.module.id) return
        const module = this.module = modules[moduleId]
        this.add(new Viewer('viewer', module))
        this.setData({
            tabSelected: index
        })
    },
    clickItem(e) {
        if (!e.currentTarget.role) {
            return app.showPost({ type: 'post', id: e.currentTarget.id })
        }
    }
}))
