const createPage = require('../../lib/createpage.js')
const Viewer = require('../../components/viewer/viewer')
const Tabbar = require('../../components/tabbar/tabbar')

var app = getApp()

Page(createPage({
    data: {
        tabs: [],
        tabSelected: 0,
        module: null
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
        app.showPost(e.currentTarget.id)
    }
}))
