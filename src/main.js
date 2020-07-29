import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import echarts from 'echarts'
// 还要特别引入china.json，这样中国地图才会出现，不然只会出现右下角的南海诸岛
import china from 'echarts/map/json/china.json'
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(Element)
echarts.registerMap('china', china)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
