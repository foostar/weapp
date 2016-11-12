const type = {}

module.exports = {
    type,
    template: {},
    create(module) {
        const typeName = `${module.type}-${module.type === 'webapp' ? 'flat' : module.style}`
        const Class = type[typeName]
        if (!Class) {
            console.warn(`${typeName} 暂不支持`)
            return null
        }
        return new Class(module.id, module)
    }
}
