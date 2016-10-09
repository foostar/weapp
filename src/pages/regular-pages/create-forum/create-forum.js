const app = getApp()
Page({
    data: {
        tempFilePaths: '',
        selectList: [],
        selectIndex: 0,
        selectType: null,
        title: '',
        content: ''
    },
    onLoad() {
        if (app.globalData.userInfo) { // 判断用户是否登录
            this.setData({
                isLogin: true,
                userInfo: app.globalData.userInfo
            })
        } else {
            // wx.redirectTo({
            //     url: '/pages/regular-pages/login/login'
            // })
        }

        app.api.forumList().then(res => {
            const { list } = res
            const selectType = list[0].board_list[0].board_id

            const selectNameArray = [] // [...Array(10).keys()]
            const selectValueArray = []

            list.forEach(categoryList => categoryList.board_list.forEach(board => {
                selectNameArray.push(`${categoryList.board_category_name}/${board.board_name}`)
                selectValueArray.push(board.board_id)
            }))
            this.setData({ selectNameArray, selectValueArray, selectType })

            {
                const { selectNameArray, selectValueArray, selectType } = this.data
                console.log({ selectNameArray, selectValueArray, selectType })
            }

        })
    },
    selectChange(e) {
        const { value: selectIndex } = e.detail
        const selectType = this.data.selectValueArray[selectIndex]
        this.setData({ selectIndex, selectType })
    },
    changeTitle(e) {
        const { value: title } = e.detail
        this.setData({ title })
    },
    changeContent(e) {
        const { value: content } = e.detail
        this.setData({ content })
    },
    chooseImg() {
        // wx.chooseImage({
        //     count: 1, // 默认9
        //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        //     success: res => {
        //         // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //         const { tempFilePaths } = res
        //         console.log(tempFilePaths)

        //         wx.uploadFile({
        //             url: `http://${appid||1111}sq.xiaoyun.com/mobcent/app/web/index.php?r=forum/sendattachmentex`,
        //             filePath: tempFilePaths[0],
        //             name: 'uploadFile[]',
        //             formData: {
        //                 type: 'image',
        //                 module: 'forum',
        //                 fid: this.data.selectType
        //             },
        //             success(res) {
        //                 console.log(res)
        //             }
        //         })
        //     }
        // })
    },
    submit() {
        const { title, content, selectType: fid } = this.data
        app.api.createTopic({ title, content, fid }).then(res => {
            console.log(res)
        })
    }
})
