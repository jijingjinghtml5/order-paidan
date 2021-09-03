import Vue from 'vue'
import FormPaperIndex from 'form-paper-index'
import ElementUI from 'element-ui'

import '@/styles/index.scss'
// import GlobalTable from '@/components/Base/GlobalTable'
// import GlobalSearch from '@/components/Base/GlobalSearch'
import CommonPrompt from '@/components/CommonDialog/prompt'
import CaseElButton from '@/components/CaseBtn/base-btn'
import LockButton from '@/components/CaseBtn/lock-btn'
import SpanElButton from '@/components/CaseBtn/span-btn'

import { CommonPromptHandleMixins } from '@/mixins/common'
import App from './App.vue'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import './directive/dialogDrag'
import './directive/preventReClick'
import '@/assets/icon/style.css'

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
// // 表单
Vue.use(FormPaperIndex)
// Vue.component('GlobalTable', GlobalTable)
// Vue.component('GlobalSearch', GlobalSearch)
Vue.component('CaseElButton', CaseElButton)
Vue.component('LockButton', LockButton)
Vue.component('SpanElButton', SpanElButton)
// 全局组件
Vue.component('CommonPrompt', CommonPrompt)
// 全局mixin
Vue.mixin(CommonPromptHandleMixins)

Vue.config.productionTip = false

new Vue({
  render: (h) => h(App),
  router,
  store
}).$mount('#app')
