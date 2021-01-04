const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          // important extra layer for less-loader^6.0.0
          javascriptEnabled: true
        }
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias.set('@$', resolve('src'))
  }
  // configureWebpack: {
  //   externals: {
  //     vue: 'Vue',
  //     'vue-router': 'VueRouter',
  //     vuex: 'Vuex',
  //     axios: 'axios'
  //   },
  //   css: [],
  //   js: [
  //     '//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
  //     '//cdn.jsdelivr.net/npm/vue-router@3.2.0/dist/vue-router.min.js',
  //     '//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
  //     '//cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js'
  //   ]
  // }
}
