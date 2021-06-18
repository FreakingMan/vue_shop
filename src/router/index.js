import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect:'/welcome',
    children : [
      {path:'/welcome', component: Welcome},
      {path:'/users', component: Users},
      {path:'/rights', component: Rights}
    ]
  },
]

const router = new VueRouter({
  routes
})
//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  next()
  //要访问的路径
  //from代表从那个路径跳转而来
  //next() next('/login')
  // if(to.path === '/login') return next();
  // const tokenStr = window.sessionStorage.getItem('token')
  // if(!tokenStr) return next('/login')
})
export default router
