
/* eslint-disable */
/*
 * @格式化文本
 */

function formateText(str = '', length = 40) {
    length = parseInt(length, 10)
    if (str.length > length) {
        str = str.substr(0, length)
        if (length !== 0) {
            str += '...'
        }
    }
    return str
}
/*
 * @格式化日期
 */
const dateFormat = (date, format = 'yyyy-MM-dd hh:mm:ss', readability = true) => {
    if (!date) return ''
    if (typeof date === 'string' && /[\u4e00-\u9fa5]+/g.test(date)) {
        return date
    }
    if (typeof date === 'string' && /^\d+$/.test(date)) {
        date = new Date(+date)
    }

    if (!(date instanceof Date)) {
        date = new Date(date)
    }

    const duration = Date.now() - date
    const level1 = 60 * 1000                // 1 分钟
    const level2 = 60 * 60 * 1000           // 1 小时
    const level3 = 24 * 60 * 60 * 1000      // 1 天
    const level4 = 3 * 24 * 60 * 60 * 1000  // 3 天
    if (readability && duration < level4) {
        let str = ''
        if (duration < level1) str = '刚刚'
        if (duration > level1 && duration < level2) str = `${Math.round(duration / level1)}分钟前`
        if (duration > level2 && duration < level3) str = `${Math.round(duration / level2)}小时前`
        if (duration > level3 && duration < level4) str = `${Math.round(duration / level3)}天前`
        return str
    }

    const o = {
        'M+': date.getMonth() + 1,  // 月份
        'd+': date.getDate(),       // 日
        'h+': date.getHours(),      // 小时
        'm+': date.getMinutes(),    // 分
        's+': date.getSeconds(),    // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(),  // 毫秒
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, String(date.getFullYear()).substr(4 - RegExp.$1.length))
    }
    Object.keys(o).forEach((k) => {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((String(o[k])).length)))
        }
    })
    return format
}
/*
 * @格式化表情
 */
const sesourceAddress = { 泪: 'lei', 怒: 'nu', 心: 'xin', 晕: 'yun', 衰: 'shuai', 来: 'lai', 萌: 'meng', 囧: 'jiong', 酷: 'ku', 汗: 'han', 嘘: 'xu', 吐: 'tu', 睡: 'shui', 包: 'bao', 耶: 'ye', 饭: 'fan', 赞: 'zan', 咖啡: 'kafei', 礼物: 'liwu', 猪头: 'zhutou', 抱抱: 'baobao', 握手: 'woshou', 吃惊: 'chijing', 白眼: 'baiyan', 疑问: 'yiwen', 阴险: 'yinxian', 送花: 'songhua', 威武: 'weiwu', 围观: 'weiguan', 撇嘴: 'piezui', 发呆: 'fadai', 敲打: 'qiaoda', 委屈: 'weiqu', 兔子: 'tuzi', 哈哈: 'haha', 抓狂: 'zhuakuang', 嘻嘻: 'xixi', 偷笑: 'touxiao', 生病: 'shengbing', 爱你: 'aini', 害羞: 'haixiu', 馋嘴: 'chanzui', 可怜: 'kelian', 鼓掌: 'guzhang', 花心: 'huaxin', 亲亲: 'qinqin', 鄙视: 'bishi', 呵呵: 'hehe', 傲慢: 'aoman', 月亮: 'yueliang', 太阳: 'taiyang', 谢谢: 'xiexie', 蓝心: 'lanxin', 神马: 'shenma', 坑爹: 'kengdie', 魔鬼: 'mogui', 紫心: 'zixin', 绿心: 'lvxin', 黄心: 'huangxin', 音符: 'yinfu', 闪烁: 'shansuo', 星星: 'xingxing', 雨滴: 'yudi', 火焰: 'huoyan', 便便: 'bianbian', 下雨: 'xiayu', 多云: 'duoyun', 闪电: 'shandian', 雪花: 'xuehua', 旋风: 'xuanfeng', 房子: 'fangzi', 烟花: 'yanhua', 踩一脚: 'caiyijiao', 有木有: 'youmuyou', 外星人: 'waixingren', 挖鼻屎: 'wabishi', 太开心: 'taikaixin', 心碎了: 'xinsuile', 糗大了: 'qiudale', 左哼哼: 'zuohengheng', 右哼哼: 'youhengheng', 做鬼脸: 'zuoguilian', 要哭了: 'yaokule', ok: 'ok', good: 'good', Hold: 'hold', ByeBye: 'byebye' }

const infoToFace = (str) => {
    const faceRegExp = /\[([^\]]*)\]/g
    const bbsFaceReg = /^mobcent/
    var result = false
    result = faceRegExp.test(str)
    str = str.replace(faceRegExp, (word, text) => {
        let data
        if (sesourceAddress[text]) {
            data = `,https://cdn-wz.xiaoyun.com/m/img/face/${sesourceAddress[text]}.png,`
        } else if (bbsFaceReg.test(text)) {
            data = `,${text.replace('mobcent_phiz=', '')},`
        } else {
            data = word
        }
        return data
    })
    var faceArr = []
    var faceResult = []
    if (result) {
        faceArr = str.split(',')
        faceArr.forEach((v) => {
            if (v) {
                if (/\/img\//g.test(v)) {
                    faceResult.push({ type: 'image', content: v })
                } else if (/^http:/.test(v)) {
                    faceResult.push({ type: 'image', content: v })
                } else {
                    faceResult.push({ type: 'text', content: v })
                }
            }
        })
        return {
            hasFace: result,
            data: faceResult
        }
    }
    return {
        hasFace: result,
        data: str
    }
}
/*
 * @页面的类别
 */
const pagetype = [
    { type: 'webapp', desc: '外部URL', isAchieve: false },
    { type: 'plugin', desc: 'plugin', isAchieve: false },
    { type: 'userinfo', desc: '用户中心', isAchieve: true },
    { type: 'userlist', desc: '用户列表', isAchieve: true },
    { type: 'messagelist', desc: '消息列表', isAchieve: true },
    { type: 'mall', desc: '微商城', isAchieve: false },
    { type: 'setting', desc: '设置', isAchieve: true },
    { type: 'search', desc: '搜索', isAchieve: false },
    { type: 'fasttext', desc: '发表文字', isAchieve: true },
    { type: 'fastimage', desc: '发表图片', isAchieve: true },
    { type: 'fastcamera', desc: '发表拍照', isAchieve: false },
    { type: 'fastaudio', desc: '发表语音', isAchieve: false },
    { type: 'sign', desc: '签到', isAchieve: false },
    { type: 'scan', desc: '二维码扫描', isAchieve: false },
    { type: 'newlivelist', desc: '直播间', isAchieve: false },
    { type: 'configSwitch', desc: '配置切换', isAchieve: false }
]
/*
 * @列表数据格式
 */
const formatListData = (dataList) => {
    let componentList = []
    dataList.forEach((v) => {
        componentList.push(Object.assign({}, v, v.extParams, {
            subject: v.extParams.summary
        }))
    })
    return componentList
}
/*
 * @判断子集是否有滚动条
 */
const checkHasScroll = (module) => {
    let app = getApp()
    if (module.type === 'subnav') {
        return true
    }
    if (module.type === 'moduleRef') {
        module = app.globalData.modules[module.extParams.moduleId]
        if (module.type === 'subnav') {
            return true
        }
    }
    
    return module.componentList.map((item) => {
        if(item.type !== 'layout' || !item.style || item.style.toLowerCase().indexOf('layout') == -1 || item.style.toLowerCase().indexOf('col') == -1 ){
            return checkHasScroll(item)
        }
    }).some(x => {
        return x
    })
}

module.exports = {
    dateFormat,
    formatTime(date) {
        return dateFormat(date)
    },
    formateText,
    formatListData,
    infoToFace,
    checkHasScroll,
    pagetype
}

