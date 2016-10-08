var app = getApp()
Page({
    data:{
        isMobileRegisterValidation: 0,
        isCloseEmail:1,
        isFastRegister: 0,
        isInviteActivity: 0,
        appColor: '',
        appIcon: '',
        mobile:'',
        code: '',
        verifyBtn:'获取验证码',
        errMessage: '',
        isShow: false,
        isVerify: false,
        isFetch: true
    },
    onLoad() {
        // 获取app 图标 主题颜色
        this.setData({
            appIcon: app.globalData.info.appIcon,
            appColor: app.globalData.info.appColor
        })
        // 获取用户的主配置信息
        app.api.getSetting().then(res => {
            this.setData({
                isMobileRegisterValidation: res.body.plugin.isMobileRegisterValidation,
                isCloseEmail: res.body.plugin.isCloseEmail,
                isFastRegister: res.body.plugin.isFastRegister,
                isInviteActivity: res.body.plugin.isInviteActivity
            })
        })
    },
    onReady() {
        if (app.globalData.userInfo) {
           wx.redirectTo({
                url:'/pages/regular-pages/my/my'    
            }) 
        }
        if (this.data.isMobileRegisterValidation == 1) {
            wx.setNavigationBarTitle({
                title: '手机号注册'
            })
        } else {
            wx.setNavigationBarTitle({
                title: '用户注册'
            })
        }
    },
    // 手机验证
    getCode: function(e) {
        if (this.data.isFetch && this.data.mobile) {
            app.api.getCode(this.data.mobile)
                .then(res => console.log(res))
                .catch(err => {
                    console.log(err)
                    if(parseInt(err.status) / 100 == 4) {
                        this.setData({
                            isShow: true,
                            errMessage: err.message
                        })
                        setTimeout(this.closeMessagePrompt, 1500)
                    }
                })
            this.changeMobileBtn()
        }
        if(!this.data.mobile) {
            this.setData({
                isShow: true,
                errMessage: '手机号不能为空'
            })
            setTimeout(this.closeMessagePrompt, 1500)
        }
    },
    // 获取页面输入手机号
    setMobile : function(e){
        console.log('获取页面输入手机号')
        this.setData({
            mobile: e.detail.value? e.detail.value: ''
        })
    },
    // 获取页面输入的验证码
    setCode(e){
        console.log('获取页面输入的验证码')
        this.setData({
            code: e.detail.value? e.detail.value: ''
        })
    },
    // 关闭页面提示信息
    closeMessagePrompt(){
        this.setData({
            isShow: false,
            errMessage:''
        })
    },
    // 
    checkMobileCode(){

    },
    // 设置按钮的内容 （倒计时）
    changeMobileBtn(){
        var i = 60;
        var timer = setInterval(() => {
            if(i >= 0) {
                this.setData({
                    verifyBtn: `请在${i--}后重发`,
                    isFetch: false
                })
            } 
            if(i == -1){
                clearInterval(timer)
                this.setData({
                    isFetch: true,
                    verifyBtn: '获取验证码'
                })
            }
        }, 1000)
    }

})