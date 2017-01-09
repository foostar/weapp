/* eslint-disable */
const createPage = require('../../lib/createpage.js')
const Viewer = require('../../components/viewer/viewer.js')
var app = getApp()
Page(createPage({
    onLoad() {
        this.render()
    },
    onShow() {
        app.ready()/*.then(() => {
            if (app.isIphone()) return
            this.setData({ test: '1' })
        })*/
    },
    render() {
        app.ready().then(() => {
            const module = app.globalData.modules['<%= moduleId %>']
            this.add(new Viewer('viewer', module))
        })
    }
}))
