const createPage = require('../../lib/createpage.js')
const Viewer = require('../../components/viewer/viewer')
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
        try {
            data.data = JSON.parse(data.data)
        } catch (err) {
            data.data = null
        }
        if (data.type) {
            module = {
                componentList: [],
                extParams: {},
                title: '',
                id: data.type,
                style: 'flat',
                type: data.type,
                data: data.data
            }
        } else {
            module = data.data
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
        this.setData({
            module,
            appIcon: app.globalData.info.appIcon,
            appColor: app.config.COLOR
        })
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
        app.showPost(e.currentTarget.id)
    }
}))
