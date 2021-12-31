import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
// 创建 Vue 的实例作为事件总线使用，将其挂载到 $eventBus 上，
// 即可在组件中直接使用 this.$eventBus.$emit() 和 this.$eventBus.$on() 来触发/监听事件
Vue.prototype.$eventBus = new Vue()

new Vue({
    vuetify,
    render: h => h(App)
}).$mount('#app')
