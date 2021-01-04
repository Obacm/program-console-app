import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const menus = [
  {
    path: '/',
    name: 'Home',
    describe: '活动管理',
    component: () => import('@/views/home')
  },
  {
    path: '/module',
    name: 'Module',
    describe: '模块管理',
    component: () => import('@/views/module')
  },
  {
    path: '/notice',
    name: 'Notice',
    describe: '公告管理',
    component: () => import('@/views/notice')
  },
  {
    path: '/group',
    name: 'Group',
    describe: '集团管理',
    component: () => import('@/views/group')
  },
  {
    path: '/doctor',
    name: 'Doctor',
    describe: '药师咨询',
    component: () => import('@/views/doctor')
  },
  {
    path: '/customer',
    name: 'Customer',
    describe: '售后客服',
    component: () => import('@/views/customer')
  }
]

const routers = [
  {
    path: '/login',
    name: 'Login',
    describe: '登陆',
    component: () => import('@/views/login')
  },
  {
    path: '/medicine',
    name: 'Medicine',
    describe: '药箱管理',
    component: () => import('@/views/home/medicine')
  },
  {
    path: '/drug',
    name: 'Drug',
    describe: '药品管理',
    component: () => import('@/views/home/drug')
  },
  {
    path: '/module-editor',
    name: 'ModuleEditor',
    describe: '模块新增',
    component: () => import('@/views/module/editor')
  },
  {
    path: '/notice-editor',
    name: 'NoticeEditor',
    describe: '公告新增',
    component: () => import('@/views/notice/editor')
  }
]

const routes = [...menus, ...routers]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export { menus }
export default router
