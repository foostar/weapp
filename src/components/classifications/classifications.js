const Component = require('../../lib/component.js')

const app = getApp()

function Classifications(key, itemData) {
    this.itemData = itemData
    Component.call(this, key)
    this.data = {
        radioIndex: 0,
        chooseShow: true,
        trasformStyle: 'transform: rotate(90deg);',
        selectedStyle: `color: #fff; background: #${app.config.COLOR};`,
        appColor: `#${app.config.COLOR}`,
        iconSrc: app.globalData.iconSrc,
        selectedChoices: [],
        tempFilePaths: null,
        inputValue: ''
    }
}

Classifications.prototype = Object.create(Component.prototype)
Classifications.prototype.name = 'classifications'
Classifications.prototype.constructor = Classifications


Classifications.prototype.onLoad = function () {
    const { classifiedType, classifiedName } = this.itemData
    this.setData({
        classifiedType,
        classifiedName
    })

    if (classifiedType === 2 || classifiedType === 4) {
        console.log('单选', this.itemData)
        let { classifiedRules: { choices } } = this.itemData
        this.setData({
            inputValue: choices[0].value
        })
    }

    if (classifiedType === 3) {
        let { classifiedRules: { choices } } = this.itemData
        choices.map((item) => {
            return item.selected = 0
        })
        this.setData({
            selectedChoices: choices
        })
    }
}

// 修改单选 多级
Classifications.prototype.bindPickerChange = function (event) {
    console.log('bindPickerChange', event)
    let { classifiedRules: { choices } } = this.itemData
    let { value } = event.detail
    this.setData({
        radioIndex: value,
        inputValue: choices[value].value
    })
}
// 多选
Classifications.prototype.bindChooseChange = function (event) {
    const { choosed } = event.currentTarget.dataset
    let { selectedChoices } = this.data
    selectedChoices[choosed].selected = !selectedChoices[choosed].selected
    this.setData({
        selectedChoices
    })
}
// 多选展示
Classifications.prototype.bindChosseShow = function () {
    this.setData({
        chooseShow: !this.data.chooseShow
    })
}
// 选择图片
Classifications.prototype.uploadpicture = function () {
    wx.chooseImage({
        count: 1,
        sizeType: [ 'compressed', 'original' ],
        sourceType: [ 'camera', 'album' ],
        success: (res) => {
            var tempFilePaths = res.tempFilePaths
            this.setData({
                tempFilePaths,
                inputValue: tempFilePaths
            })
        }
    })
}
// 文本输入内容
Classifications.prototype.bindInputChange = function (event) {
    let { value } = event.detail
    this.setData({
        inputValue: value
    })
}
// 文本框输入
Classifications.prototype.bindTextareaChange = function (event) {
    let { value } = event.detail
    this.setData({
        inputValue: value
    })
}


module.exports = Classifications
