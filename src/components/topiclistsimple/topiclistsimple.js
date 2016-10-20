const Component = require('../../lib/component')

const app = getApp()

function TopiclistSimple(key, module) {
    Component.call(this, key)
    app.getResources(module)
        .then(data => {
            console.log("resources",data)
            this.setData({
                module,
                resources: data,
                isLoading: true,
                appIcon: app.globalData.info.appIcon
            })
        })
}

TopiclistSimple.prototype = Object.create(Component.prototype)
TopiclistSimple.prototype.name = 'topiclistsimple'
TopiclistSimple.prototype.constructor = TopiclistSimple
module.exports = TopiclistSimple
