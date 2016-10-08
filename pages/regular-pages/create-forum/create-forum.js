const app = getApp()
Page({
    data: {
        tempFilePaths: '',
        selectList: [],
        selectIndex: 0,
        selectType: null
    },
    selectChange(e) {
        const { value: selectIndex } = e.detail
        const selectType = this.data.selectList[selectIndex].board_category_id
        this.setData({ selectIndex, selectType })
    },
    onLoad() {
        console.log(app.globalData)
        app.api.forumList().then(res => {
            const { list: selectList } = res
            const selectType = selectList[0].board_category_id
            const selectArray = selectList.map(item => item.board_category_name)
            this.setData({ selectArray, selectList, selectType })
        })
    },
    chooseImg() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: res => {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                const { tempFilePaths } = res
                console.log(tempFilePaths)

                wx.uploadFile({
                    url: `http://${appid||1111}sq.xiaoyun.com/mobcent/app/web/index.php?r=forum/sendattachmentex`,
                    filePath: tempFilePaths[0],
                    name: 'uploadFile[]',
                    formData: {
                        type: 'image',
                        module: 'forum',
                        fid: this.data.selectType
                    },
                    success(res) {
                        console.log(res)
                    }
                })
            }
        })
    }
})
