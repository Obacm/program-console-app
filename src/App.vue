<template>
  <a-config-provider :locale="locale">
    <a-layout id="components-layout-demo-top-side-2" v-if="$router.currentRoute.name !== 'Login'">
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
            :selected-keys="[index]"
            :default-open-keys="['sub']"
            :style="{ height: '100%', borderRight: 0 }"
          >
            <a-sub-menu key="sub">
              <span slot="title"><a-icon type="minus" />首页配置</span>
              <a-menu-item
                :key="index + 1"
                v-for="(route, index) in routes"
                @click="
                  setHistories(
                    {
                      path: `${route.path}`,
                      meta: {
                        name: $t(`navs.${route.meta.name}`)
                      }
                    },
                    true
                  )
                "
              >
                <router-link :to="route.path">{{ $t(`navs.${route.meta.name}`) }}</router-link>
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

            <template v-for="(history, index) in histories">
              <a-breadcrumb-separator :key="index">></a-breadcrumb-separator>
              <a-breadcrumb-item :key="index">
                <router-link
                  :to="history.path"
                  @click.native="setHistories(history, index === 0 ? true : false)"
                >
                  {{ history.meta.name }}
                </router-link>
              </a-breadcrumb-item>
            </template>
          </a-breadcrumb>

          <a-layout-content :style="{ background: '#fff', padding: '15px', flex: 'initial' }">
            <router-view />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
    <div v-else>
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import { menus } from '@/router'
import { storage } from '@/common/utils/storage'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  data() {
    return {
      collapsed: false,
      routes: [],
      menus: [],
      specials: ['/category-medicine'],
      index: 1,
      locale: zhCN
    }
  },
  created() {
    this.routes = menus
    this.menus = this.routes.map(item => item.path)
  },
  methods: {
    setHistories(history, type) {
      this.$store.commit('SET_HOSTORIES', { history: history, type: type })
    }
  },
  computed: {
    histories() {
      return this.$store.getters.histories
    }
  },
  watch: {
    $route() {
      let index = this.menus.indexOf(this.$route.path)
      switch (this.$route.path) {
        case '/notice-editor':
          this.index = 3
          break
        case '/module-editor':
          this.index = 2
          break
        case '/category-medicine':
          this.index = 8
          break
        default:
          this.index = index < 0 ? index + 2 : index + 1
      }
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
.table-search-wrapper {
  margin-bottom: 15px;
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
