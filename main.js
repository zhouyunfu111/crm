import Vue from 'vue'
import App from './App'
import store from './store' // store
import plugins from './plugins' // plugins
import './permission' // permission
import uView from '@/uni_modules/uview-ui'
import util from 'utils/util'
import configs from './config'

Vue.use(uView)
Vue.use(plugins)

Vue.config.productionTip = false
Vue.prototype.$util = util;
Vue.prototype.$store = store
Vue.prototype.$config = configs;


App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
