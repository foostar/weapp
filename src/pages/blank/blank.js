const createPage = require('../../lib/createpage.js')
const Viewer = require('../../components/viewer/viewer.js')
const untils = require('../../utils/util.js')

const pagetype = untils.pagetype
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
        let module
        if (data.type) {
            module = {
                componentList: [],
                extParams: {},
                title: '',
                id: data.type,
                style: 'flat',
                type: data.type,
                data: data.data ? JSON.parse(data.data) : ''
            }
        } else {
            module = app.globalData.moduleData
        }
        // 检测是否支持当前版块
        pagetype.forEach((v) => {
            if (v.type == module.type && !v.isAchieve) {
                module = {
                    componentList: [],
                    extParams: {},
                    title: '出错了！',
                    style: 'support',
                    type: 'not'
                }
            }
        })
        // 加载module
        this.add(new Viewer('viewer', module))
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
