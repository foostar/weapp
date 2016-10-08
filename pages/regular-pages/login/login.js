var app = getApp()
Page({
    data:{
        appIcon: '',
        appColor: '',
        errMessage: '',
        isShow:false
    },
    onLoad(){
        console.log(app)
        // 获取app 图标 主题颜色
        this.setData({
            appIcon: app.globalData.info.appIcon,
            appColor: app.globalData.info.appColor
        })
    },
    onReady(){
        wx.setNavigationBarTitle({
          title: '登录'
        })
    },
    login(e){
        const {username, password} = e.detail.value
        app.api.signin(username, password)
        .then(res => {
            console.log(res)
        })
        .catch((err) => {
            console.log(err)
            if(parseInt(err.status) / 100 == 4) {
                this.setData({
                    isShow: true,
                    errMessage: err.message
                })
                setTimeout(this.closeMessagePrompt, 1500)
            }
        })
    },
    closeMessagePrompt(){
        this.setData({
            isShow: false,
            errMessage:''
        })
    }


})