import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import ElementUI from 'element-ui';
import VCharts from 'v-charts';
import { sync } from 'vuex-router-sync';
import 'element-ui/lib/theme-chalk/index.css';
import '@assets/style/global.css';

Vue.use(ElementUI);
Vue.use(VCharts);
sync(store, router);

Vue.config.productionTip = false;
const requireComponent = require.context('@components', false, /Page[A-Z]\w+\.(vue|js)$/);
requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)
  // 获取组件的 PascalCase 命名
  const componentName = upperFirst(
    // 剥去文件名开头的 `./` 和结尾的扩展名
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
  )
  // 全局注册组件
  Vue.component(componentName, componentConfig.default || componentConfig)
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
