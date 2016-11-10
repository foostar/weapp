const createPage = require('../../lib/createpage.js')
const Viewer = require('../../components/viewer/viewer')

var app = getApp()
Page(createPage({
    onLoad() {
        this.render()
    },
    onShow() {
        if (app.isIphone()) return
        this.render()
    },
    render() {
        app.ready().then(() => {
            const module = app.globalData.modules['<%= moduleId %>']
            this.add(new Viewer('viewer', module))
        })
    }
}))
