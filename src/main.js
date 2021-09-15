import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

import ZkTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


//导入字体图标
import './assets/fonts/iconfont.css'

import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    /*
    1.后台除了登录接口之外，都需要token权限验证，我们可以通过添加axios请求拦截器来添加token，以保证拥有获取数据的权限
    2.在每个API请求头中添加Authorization字段
    3.request请求拦截器
    4.只要向服务器端通过axios发送数据请求，在发送请求到达服务器之前，会调用这个回调函数，对请求头做一下预处理
    5.登录过程中Authorization字段为null,当我们登陆后再去调用其它接口API，再去监听这次请求，Authorization就会获得token令牌,就能获得权限调用其他API
    */
    // 在挂载axios原型对象之前
    //请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
    //console.log(config)
    //为请求头对象，添加token验证的Authorization字段
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table', ZkTable)
    //将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

//定义全局格式化时间过滤器
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
        // padStart(2, '0')不足两位的字符串前面补零
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')