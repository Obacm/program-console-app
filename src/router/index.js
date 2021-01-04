import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'
import Home from '../views/home'
import Module from '../views/module'
import Notice from '../views/notice'
import Group from '../views/group'
import Doctor from '../views/doctor'
import Customer from '../views/customer'
import Medicine from '../views/home/medicine'
import Drug from '../views/home/drug'
import ModuleEditor from '../views/module/editor'
import NoticeEditor from '../views/notice/editor'

Vue.use(VueRouter)

const menus = [
  {
    path: '/',
    name: 'Home',
    describe: '活动管理',
    component: Home
  },
  {
    path: '/module',
    name: 'Module',
    describe: '模块管理',
    component: Module
  },
  {
    path: '/notice',
    name: 'Notice',
    describe: '公告管理',
    component: Notice
  },
  {
    path: '/group',
    name: 'Group',
    describe: '集团管理',
    component: Group
  },
  {
    path: '/doctor',
    name: 'Doctor',
    describe: '药师咨询',
    component: Doctor
  },
  {
    path: '/customer',
    name: 'Customer',
    describe: '售后客服',
    component: Customer
  }
]

const routers = [
  {
    path: '/login',
    name: 'Login',
    describe: '登陆',
    component: Login
  },
  {
    path: '/medicine',
    name: 'Medicine',
    describe: '药箱管理',
    component: Medicine
  },
  {
    path: '/drug',
    name: 'Drug',
    describe: '药品管理',
    component: Drug
  },
  {
    path: '/module-editor',
    name: 'ModuleEditor',
    describe: '模块新增',
    component: ModuleEditor
  },
  {
    path: '/notice-editor',
    name: 'NoticeEditor',
    describe: '公告新增',
    component: NoticeEditor
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
