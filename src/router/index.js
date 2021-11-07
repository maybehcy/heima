// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import GoodsList from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () =>
    import ( /* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
    // import Login from './components/Login.vue'
const Home = () =>
    import ( /* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
    // import Home from './components/Home.vue'
const Welcome = () =>
    import ( /* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')
    // import Welcome from './components/Welcome.vue'
const Users = () =>
    import ( /* webpackChunkName:"user" */ '../components/user/Users.vue')
    // import Users from './components/user/Users.vue'
const Rights = () =>
    import ( /* webpackChunkName:"power" */ '../components/power/Rights.vue')
    // import Rights from './components/power/Rights.vue'
const Roles = () =>
    import ( /* webpackChunkName:"power" */ '../components/power/Roles.vue')
    // import Roles from './components/power/Roles.vue'
const Cate = () =>
    import ( /* webpackChunkName:"goods" */ '../components/goods/Cate.vue')
    // import Cate from './components/goods/Cate.vue'
const Params = () =>
    import ( /* webpackChunkName:"goods" */ '../components/goods/Params.vue')
    // import Params from './components/goods/Params.vue'
const GoodsList = () =>
    import ( /* webpackChunkName:"goods" */ '../components/goods/List.vue')
    // import GoodList from './components/goods/List.vue'
const Add = () =>
    import ( /* webpackChunkName:"goods" */ '../components/goods/Add.vue')
    // import GoodAdd from './components/goods/Add.vue'
const Order = () =>
    import ( /* webpackChunkName:"order" */ '../components/order/Order.vue')
    // import Order from './components/order/Order.vue'
const Report = () =>
    import ( /* webpackChunkName:"report" */ '../components/report/Report.vue')
    // import Report from './components/report/Report.vue'
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
            { path: '/roles', component: Roles },
            { path: '/categories', component: Cate },
            {
                path: '/params',
                component: Params
            },
            {
                path: '/goods',
                component: GoodsList
            }, {
                path: '/goods/add',
                component: Add
            },
            {
                path: '/orders',
                component: Order
            },
            {
                path: '/reports',
                component: Report
            }
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