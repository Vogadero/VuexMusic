export default (vue) => {
    // 1、自定义全局自动聚焦
    vue.directive('focus', {
        inserted: function (el) {
            el.focus()
        }
    })
}