const TouchComponent = require('../../lib/touchcomponent')
const util = require('../../utils/util.js')

function LayoutNewsAuto(key, module) {
    TouchComponent.call(this, key, module)
    const componentList = util.formatListData(module.componentList)
    componentList.map((v) => {
        v.last_reply_date = util.dateFormat(v.last_reply_date, 'yyyy-MM-dd')
        let faceResult = util.infoToFace(v.subject)
        v.hasFace = faceResult.hasFace
        v.subject = faceResult.data
        return v
    })
    this.data = {
        style: module.style,
        componentList
    }
}

LayoutNewsAuto.prototype = Object.create(TouchComponent.prototype)
LayoutNewsAuto.prototype.name = 'layoutnewsauto'
LayoutNewsAuto.prototype.constructor = LayoutNewsAuto

module.exports = LayoutNewsAuto
