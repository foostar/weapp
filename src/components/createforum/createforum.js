const Component = require('../../lib/component')

const app = getApp()

function Createforum(key, module) {
    console.log(module)
    this.pageData = module.data ? module.data : ''
    Component.call(this, key)
    this.data = {
        isLogin: false,
        userInfo: {},
        tempFilePaths: '',
        selectList: [],
        selectIndex: 0,
        selectType: null,
        title: '',
        content: '',
        imagelist: [],
        deleteUrl: '',
        actType: '',
        isTopic: false,
        tiId: '',
        fid: null,
        appColor: '#ccc',
        isfocus: false   // textarea 焦点
    }
}

Createforum.prototype = Object.create(Component.prototype)
Createforum.prototype.name = 'createforum'
Createforum.prototype.constructor = Createforum

Createforum.prototype.onLoad = function () {
    let opts = this.pageData
    let fid = opts.fid ? opts.fid : null
    let actType = opts.actType ? opts.actType : 'new'
    let isTopic = opts.isTopic ? opts.isTopic : false
    let tiId = opts.ti_id ? opts.ti_id : ''

    let data = {
        actType,
        isTopic,
        tiId,
        fid
    }

    if (app.globalData.userInfo) {
        // 判断用户是否登录
        Object.assign(data, {
            isLogin: true,
            userInfo: app.globalData.userInfo,
            appColor: app.globalData.info.appColor
        })
    } else {
        console.info('no auth')
    }
    // 当没有版块ID时 需要获取板块列表
    if (!fid) {
        app.api.forumList().then((res) => {
            const { list } = res
            const selectType = list[0].board_list[0].board_id
            const selectNameArray = [] // [...Array(10).keys()]
            const selectValueArray = []
            list.forEach(categoryList => categoryList.board_list.forEach((board) => {
                selectNameArray.push(`${categoryList.board_category_name}/${board.board_name}`)
                selectValueArray.push(board.board_id)
            }))
            Object.assign(data, { selectNameArray, selectValueArray, selectType })
            this.setData(data)
        })
    } else {
        Object.assign(data, { selectType: fid })
        this.setData(data)
    }
}


module.exports = Createforum
