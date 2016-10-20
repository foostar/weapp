const createPage = require('../../lib/createpage.js')
const NotSupport = require('../../components/notsupport/notsupport.js')

Page(createPage({
    onLoad() {
        this.add(new NotSupport('notsupport'))
    }
}))
