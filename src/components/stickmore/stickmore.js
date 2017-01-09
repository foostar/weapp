const Component = require('../../lib/component.js')

const app = getApp()

function StickMore(key, module) {
    Component.call(this, key)
    this.data = {
        style: 'flat',
        list: module.data.toplist,
        iconSrc: app.globalData.iconSrc,
    }
}
StickMore.prototype = Object.create(Component.prototype)
StickMore.prototype.name = 'stickmore'
StickMore.prototype.constructor = StickMore
StickMore.prototype.clickItem = function (e) {
    if (e.target.dataset.role == 'avatar') {
        app.showUserHome(e.currentTarget.dataset.user)
    }
    if (e.target.dataset.role == 'forumName') {
        return app.showTopic({
            eventKey: e.currentTarget.dataset.eventKey,
            id: e.target.dataset.id,
            title: e.target.dataset.title
        })
    }
    app.showPost({ type: 'post', id: e.currentTarget.id })
}

module.exports = StickMore
