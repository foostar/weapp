const ListComponent = require('../../lib/listcomponent')
const util = require('../../utils/util.js')

const app = getApp()

function MyinfoPost(key, module) {
    if (module.data) {
        this.papeData = module.data
    }
    ListComponent.call(this, key)
    this.data = {
        list: [],
        isLoading: false,
        showList: true,
        iconSrc: app.globalData.iconSrc,
        appIcon: app.globalData.info.appIcon,
        over: false
    }
}

MyinfoPost.prototype = Object.create(ListComponent.prototype)
MyinfoPost.prototype.name = 'myinfopost'
MyinfoPost.prototype.constructor = MyinfoPost

MyinfoPost.prototype.fetchData = function (param, number) {
    let list = param.list || this.data.list || []
    if (this.data.over) return Promise.reject()
    this.setData({
        isLoading: true
    })
    return app.api.getNewNotifyList('post', {
        page: param.page
    }).then(data => {
        console.log(data)
        data.body.data = data.body.data.map((v) => {
            v.replied_date = util.dateFormat(v.replied_date, 'yyyy-MM-dd')
            return v
        })
        list = list.concat(data.body.data)
        this.setData({
            list,
            isLoading: false,
            over: param.page >= parseInt((data.total_num / number) + 1, 10)
        })
    })
}

module.exports = MyinfoPost
