import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        // 当我们访问/home就会重定向会/welcome
        redirect: '/welcome',
        //添加子组件，然后在home.vue对应的位置放置路由占位符
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles }
        ]
    }

]

const router = new VueRouter({
        routes
    })
    //挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to, from, next) => {
    //如果访问登录页就放行
    if (to.path === '/login')
        return next();

    //如果访问权限页，则要获取token
    const tokenStr = window.sessionStorage.getItem('token');
    //如果token不存在就返回登录页
    if (!tokenStr)
        return next('/login');

    next();

})

export default router