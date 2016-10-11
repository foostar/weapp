const { dateFormat } = require('../../../utils/util.js')

const app = getApp()

const attribs = (node) => {
    if (node.attrs) {
        node.attribs = {}
        node.attrs.forEach((attr) => {
            node.attribs[attr.name] = attr.value
        })
    }
    if (node.parentNode) {
        delete node.parentNode
    }
    node.childNodes && node.childNodes.forEach((child) => {
        attribs(child)
    })
    return node
}

Page({
    data: {
        topic: null
    },
    onLoad() {
        app.api.post(app.globalData.postId)
            .then((data) => {
                data.topic.create_date = dateFormat(data.topic.create_date)
                data.list.forEach((x) => {
                    x.posts_date = dateFormat(x.posts_date)
                })
                this.setData(data)
            })
    },
    onReady() {
    }
})
