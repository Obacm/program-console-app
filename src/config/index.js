const dev = 'http://192.168.0.164:8052'
// const pro = 'https://z-chinakang.com'
const pro = 'http://47.96.30.27:8052'

const devWeb = 'http://localhost:8080'
// const proWeb = 'http://shop.z-chinakang.com'
const proWeb = 'http://47.96.30.27:8098'

// 我现在在开发环境打印process.env.NODE_ENV结果为：development
// 我现在生产环境(线上)打印process.env.NODE_ENV结果为：production
export const baseURL =
  process.env.NODE_ENV === 'production'
    ? // ? pro + '/wechat-service' // 生产环境接口地址
      pro + '/wechat-pc-test' // 生产环境接口地址
    : // pro + '/wechat-pc-test' // 生产环境接口地址
      dev + '/wechat-pc-test' // 开发环境接口地址

export const webURL =
  process.env.NODE_ENV === 'production'
    ? proWeb // 生产前端地址
    : devWeb // 开发前端地址

export const path = process.env.NODE_ENV
