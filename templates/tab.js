const createPage = require('../../lib/createpage.js')
const Viewer = require('../../components/viewer/viewer')

var app = getApp()
Page(createPage({
    onLoad() {
        app.ready().then(() => {
            const module = app.globalData.modules['<%= moduleId %>']
            console.log(module)
            this.add(new Viewer('viewer', module))
        })
    }
}))
