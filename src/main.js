import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import { uploadUrl } from '@/api'
import i18n from '@/i18n'
import VueMeta from 'vue-meta'
import lodash from 'lodash'
import '@/global.less'
import {
  Layout,
  Button,
  Breadcrumb,
  Checkbox,
  Input,
  FormModel,
  Popconfirm,
  Menu,
  Modal,
  Select,
  Upload,
  Table,
  Switch,
  Spin,
  Icon,
  Message,
  DatePicker,
  ConfigProvider
} from 'ant-design-vue'

Vue.config.productionTip = false

Vue.use(Button)
Vue.use(Breadcrumb)
Vue.use(Layout)
Vue.use(Checkbox)
Vue.use(Input)
Vue.use(FormModel)
Vue.use(Popconfirm)
Vue.use(Menu)
Vue.use(Select)
Vue.use(Modal)
Vue.use(Upload)
Vue.use(Switch)
Vue.use(Table)
Vue.use(Spin)
Vue.use(Icon)
Vue.use(Message)
Vue.use(DatePicker)
Vue.use(ConfigProvider)
Vue.use(VueMeta)

Vue.prototype.uploadURL = uploadUrl
Vue.prototype._ = lodash
Vue.prototype.$message = Message
Vue.prototype.$confirm = Modal.confirm

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
