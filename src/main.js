import Vue from 'vue'

import ElementUI from 'element-ui'

import '@/styles/index.scss'
import GlobalTable from '@/components/Base/GlobalTable'
import GlobalSearch from '@/components/Base/GlobalSearch'
import GlobalDialog from '@/components/Base/GlobalDialog'

import App from './App.vue'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import './directive/dialogDrag'

// eslint-disable-next-line
Date.prototype.Format = function (fmt) {
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'S+': this.getMilliseconds()
  }
  // 因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
  if (/(y+)/.test(fmt)) {
    // 第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      // 第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(String(o[k]).length)
      )
    }
  }
  return fmt
}

Vue.use(ElementUI, { size: 'mini' })
Vue.component('GlobalTable', GlobalTable)
Vue.component('GlobalSearch', GlobalSearch)
Vue.component('GlobalDialog', GlobalDialog)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
  router,
  store
}).$mount('#app')
