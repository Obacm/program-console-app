<template>
  <div id="app">
    <a-layout
      id="components-layout-demo-top-side-2"
      v-if="$router.currentRoute.name !== 'Login'"
    >
      <a-layout-header
        class="header"
        style="background: #fff; height:75px; border-bottom-style: inset"
      >
        <div class="logo" />
      </a-layout-header>
      <a-layout>
        <a-layout-sider
          width="200"
          style="background: #fff"
          :style="{ overflow: 'auto', height: '100vh' }"
        >
          <a-menu
            mode="inline"
            :default-selected-keys="[index]"
            :default-open-keys="['sub']"
            :style="{ height: '100%', borderRight: 0 }"
          >
            <a-sub-menu key="sub">
              <span slot="title"><a-icon type="minus" />首页配置</span>
              <a-menu-item
                :key="index + 1"
                v-for="(item, index) in items"
                @click="setName(item.describe)"
              >
                <router-link :to="item.path">{{ item.describe }}</router-link>
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
        </a-layout-sider>
        <a-layout style="padding: 0 24px 24px">
          <a-breadcrumb separator="" style="margin: 16px 0">
            <a-breadcrumb-item>当前位置</a-breadcrumb-item>
            <a-breadcrumb-separator>:</a-breadcrumb-separator>
            <a-breadcrumb-item>
              首页配置
            </a-breadcrumb-item>
            <a-breadcrumb-separator v-if="name">></a-breadcrumb-separator>
            <a-breadcrumb-item>
              {{ name }}
            </a-breadcrumb-item>
            <a-breadcrumb-separator v-if="name && next"
              >></a-breadcrumb-separator
            >
            <a-breadcrumb-item>
              {{ next }}
            </a-breadcrumb-item>
          </a-breadcrumb>

          <a-layout-content
            :style="{ background: '#fff', padding: '15px', flex: 'initial' }"
          >
            <router-view />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script>
import { menus } from '@/router'
export default {
  data() {
    return {
      collapsed: false,
      items: [],
      menus: []
    }
  },
  created() {
    this.items = menus
    this.menus = this.items.map(item => item.describe)
  },
  methods: {
    setName(describe) {
      this.$store.commit('SET_NAME', describe)
    }
  },
  computed: {
    name() {
      return this.$store.getters.name
    },
    index() {
      return this.menus.indexOf(this.name) + 1
    },
    next() {
      return this.$store.getters.next
    }
  }
}
</script>

<style>
#components-layout-demo-top-side-2 .logo {
  width: 200px;
  height: 40px;
  background-image: url('assets/logo.png');
  background-size: 100% 100%;
  margin: 16px 28px 16px 0;
  float: left;
}
.table-operator {
  margin-bottom: 15px;
  text-align: right;
}
.button-left {
  margin-left: 15px;
}
.banner {
  width: 80px;
  height: 50px;
}
</style>
