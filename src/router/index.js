import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const menus = [
  {
    path: '/',
    name: 'Home',
    meta: {
      name: 'home',
      visible: true
    },
    component: () => import('@/views/home'),
    children: [
      {
        path: 'medicine',
        name: 'Medicine',
        meta: {
          name: '药箱管理',
          visible: false
        },
        component: () => import('@/views/home/medicine')
      },
      {
        path: 'drug',
        name: 'Drug',
        meta: {
          name: '药品管理',
          visible: false
        },
        component: () => import('@/views/home/drug')
      }
    ]
  },
  {
    path: '/module',
    name: 'Module',
    meta: {
      name: 'module',
      visible: true
    },
    component: () => import('@/views/module'),
    children: [
      {
        path: '/module-editor',
        name: 'ModuleEditor',
        meta: {
          name: '模块新增',
          visible: false
        },
        component: () => import('@/views/module/editor')
      }
    ]
  },
  {
    path: '/notice',
    name: 'Notice',
    meta: {
      name: 'notice',
      visible: true
    },
    component: () => import('@/views/notice'),
    children: [
      {
        path: '/notice-editor',
        name: 'NoticeEditor',
        meta: {
          name: '公告管理',
          visible: false
        },
        component: () => import('@/views/notice/editor')
      }
    ]
  },
  {
    path: '/group',
    name: 'Group',
    meta: {
      name: 'group',
      visible: true
    },
    component: () => import('@/views/group')
  },
  {
    path: '/doctor',
    name: 'Doctor',
    meta: {
      name: 'doctor',
      visible: true
    },
    component: () => import('@/views/doctor')
  },
  {
    path: '/customer',
    name: 'Customer',
    meta: {
      name: 'customer',
      visible: true
    },
    component: () => import('@/views/customer')
  },
  {
    path: '/machine',
    name: 'Machine',
    meta: {
      name: 'machine',
      visible: true
    },
    component: () => import('@/views/machine')
  },
  {
    path: '/category',
    name: 'Catrgory',
    meta: {
      name: 'category',
      visible: true
    },
    component: () => import('@/views/category'),
    children: [
      {
        path: '/category-medicine',
        name: 'CategoryMedicine',
        meta: {
          name: '药箱列表',
          visible: false
        },
        component: () => import('@/views/category/medicine')
      }
    ]
  },
  {
    path: '/order',
    name: 'Order',
    meta: {
      name: 'order',
      visible: true
    },
    component: () => import('@/views/order'),
    children: [
      {
        path: '/order-drug',
        name: 'OrderDrug',
        meta: {
          name: '订单详情',
          visible: false
        },
        component: () => import('@/views/order/drug')
      }
    ]
  }
]

const routers = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      name: '登陆',
      visible: true
    },
    component: () => import('@/views/login')
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
