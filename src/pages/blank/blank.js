const createPage = require('../../lib/createpage.js')
const Viewer = require('../../components/viewer/viewer.js')

var app = getApp()
Page(createPage({
    data: {
        userinfo: {},
        module: null,
        resources: {},
        title: '',
        toView: '',
        isLoading: false,
        appIcon: '',
        appColor: '',
        golbalFetch: true
    },
    onLoad(data) {
        if (data.data) {
            data.data = JSON.parse(decodeURIComponent(data.data))
        } else {
            data.data = {}
        }
        const module = {
            componentList: data.data.componentList || [],
            extParams: data.data.extParams || {},
            title: data.data.title || '',
            id: data.data.id || data.data.eventKey || data.type,
            style: data.data.style || 'flat',
            type: data.type,
            data: data.data.componentList ? '' : data.data
        }
        // 检测是否支持当前版块
        // pagetype.forEach((v) => {
        //     if (v.type == module.type && !v.isAchieve) {
        //         module = {
        //             componentList: [],
        //             extParams: {},
        //             title: '出错了！',
        //             style: 'support',
        //             type: 'not'
        //         }
        //     }
        // })
        // 加载module
        app.ready().then(() => {
            this.add(new Viewer('viewer', module))
        })
    },
    imageLoaded(e) {
        console.log(111)
        console.log(this.data)
        console.log(e)
        // const windowWidth = this.data.windowWidth
        // const imageWidth = e.detail.width
        // const imageHeight = e.detail.height
        // const index = e.currentTarget.dataset.index
        // this.data.content[index].unloaded = false
        // this.data.content[index].imageHeight = `${((windowWidth * imageHeight) / imageWidth).toFixed(2)}px`

        // this.setData(this.data)
    },
    onReady() {
    },
    goToTop() {
        this.setData({
            // scrollTop:    0
            toView: 'top'
        })
    },
    clickItem(e) {
        app.showPost({ type: 'post', id: e.currentTarget.id })
    },
    replyPost(e) {
        app.replyPost({ fid: e.currentTarget.dataset.boardid })
    },
    toUserhome(e) {
        app.showUserHome(e.currentTarget.dataset.uid)
    }
}))
