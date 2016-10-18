const ForumlistSplit = require('../components/forumlistsplit/forumlistsplit')
const type = {
    'forumlist-boardSplit': ForumlistSplit
}

const template = {
    'forumlist-boardSplit': 'forumlistsplit'
}

module.exports = {
    type,
    template,
    create(module) {
        const typeName = `${module.type}-${module.style}`
        const Class = type[typeName]
        if (!Class) {
            console.log(`${typeName} 暂不支持`)
            return null
        }
        return new Class(`m_${module.id}`, module)
    }
}
