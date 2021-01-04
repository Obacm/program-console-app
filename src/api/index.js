import axios from './axios'

/**
 * 上传路径
 */
export const uploadUrl = axios.uploadUrl

/**
 * Login
 */
export const login = params => axios.post('/auth/api/pcLogin', params)

/***************************
 ********* 活动管理 *********
 **************************/

/**
 * 活动列表
 * @param {*} params
 */
export const getActivities = params =>
  axios.get('/wechatActivity/query/getWechatActivityPage', params)

/**
 * 活动详情
 * @param {*} params
 */
export const getActivity = params =>
  axios.get('/wechatActivity/query/geWechatActivityById', params)

/**
 * 活动下架
 * @param {*} params
 */
export const offActivities = params =>
  axios.post('/wechatActivity/api/offShelf', params)

/**
 * 活动上架
 * @param {*} params
 */
export const putActivities = params =>
  axios.post('/wechatActivity/api/putShelf', params)

/**
 * 活动删除
 * @param {*} params
 */
export const deleteActivities = params =>
  axios.post('/wechatActivity/api/deletWechatActivityById', params)

/**
 * 活动新增/更新
 * @param {*} params
 */
export const saveActivity = params =>
  axios.post('/wechatActivity/api/saveWechatActivity', params)

/**
 * 活动药品
 * @param {*} params
 */
export const getActivityDrugs = params =>
  axios.get('/wechatActivityDrug/query/getWechatActivityPage', params)

/**
 * 活动药品删除
 * @param {*} params
 */
export const deleteActivityDrugs = params =>
  axios.post('/wechatActivityDrug/api/deletWechatActivityDrugById', params)

/**
 * 活动药品新增
 * @param {*} params
 */
export const saveActivityDrug = params =>
  axios.post('/wechatActivityDrug/api/saveWechatActivityDrug', params)

/**
 * 药箱列表获取
 * @param {*} params
 */
export const getActivityMedicines = params =>
  axios.get(
    '/wechatActivityMedicine/query/getWechatActivityMedicinePage',
    params
  )

/***************************
 ********* 模块管理 *********
 **************************/

/**
 * 模块列表
 * @param {*} params
 */
export const getModules = params =>
  axios.get('/wechatModuleMessage/query/getModuleMessagePage', params)

/**
 * 模块详情
 * @param {*} params
 */
export const getModule = params =>
  axios.get('/wechatModuleMessage/query/getModuleMessagePageById', params)

/**
 * 模块下架
 * @param {*} params
 */
export const offModules = params =>
  axios.post('/wechatModuleMessage/api/offShelf', params)

/**
 * 模块上架
 * @param {*} params
 */
export const putModules = params =>
  axios.post('/wechatModuleMessage/api/putShelf', params)

/**
 * 模块删除
 * @param {*} params
 */
export const deleteModules = params =>
  axios.post('/wechatModuleMessage/api/deletWechatModuleMessageById', params)

/**
 * 模块新增/更新
 * @param {*} params
 */
export const saveModule = params =>
  axios.post('/wechatModuleMessage/api/saveWechatModuleMessage', params)

/***************************
 ********* 公告管理 *********
 **************************/

/**
 * 公告列表
 * @param {*} params
 */
export const getNotices = params =>
  axios.get('/wechatNoticeMessage/query/getNoticeMessagePage', params)

/**
 * 公告详情
 * @param {*} params
 */
export const getNotice = params =>
  axios.get('/wechatNoticeMessage/query/getNoticeMessagePageById', params)

/**
 * 公告下架
 * @param {*} params
 */
export const offNotices = params =>
  axios.post('/wechatNoticeMessage/api/offShelf', params)

/**
 * 公告上架
 * @param {*} params
 */
export const putNotices = params =>
  axios.post('/wechatNoticeMessage/api/putShelf', params)

/**
 * 公告删除
 * @param {*} params
 */
export const deleteNotices = params =>
  axios.post('/wechatNoticeMessage/api/deletWechatNoticeMessageById', params)

/**
 * 公告新增/更新
 * @param {*} params
 */
export const saveNotice = params =>
  axios.post('/wechatNoticeMessage/api/saveWechatNoticeMessage', params)

/***************************
 ********* 集团管理 *********
 **************************/

/**
 * 集团详情
 * @param {*} params
 */
export const getGroup = () =>
  axios.get('/sysGroupInfo/query/getGroupInfoDetailById')

/**
 * 集团更新
 * @param {*} params
 */
export const saveGroup = params =>
  axios.post('/sysGroupInfo/api/saveGroupInfo', params)

/***************************
 ********* 药师咨询 *********
 **************************/

/**
 * 药师咨询详情
 * @param {*} params
 */
export const getDoctor = () =>
  axios.get('/wechatPharmacistAdvisory/query/getPharmacistAdvisoryDetailById')

/**
 * 药师咨询更新
 * @param {*} params
 */
export const saveDoctor = params =>
  axios.post('/wechatPharmacistAdvisory/api/savePharmacistAdvisoryInfo', params)

/***************************
 ********* 售后客服 *********
 **************************/

/**
 * 售后客服详情
 * @param {*} params
 */
export const getCustomer = () =>
  axios.get('/wechatCustomerAdvisory/query/getCustomerAdvisoryDetailById')

/**
 * 售后客服更新
 * @param {*} params
 */
export const saveCustomer = params =>
  axios.post('/wechatCustomerAdvisory/api/saveCustomerAdvisoryInfo', params)

/***************************
 ********* 省市接口 *********
 **************************/

/**
 * 省市获取
 * @param {*} params
 */
export const getCities = params =>
  axios.get('/sysNation/query/getSysNationInfo', params)

/***************************
 ******* 药箱列表接口 *******
 **************************/

/**
 * 药箱接口
 * @param {*} params
 */
export const getMedicines = params =>
  axios.get('/wechatMedicineChestInfo/query/getWechatMedicineChestAll', params)

/**
 * 活动药箱新增
 * @param {*} params
 */
export const saveActivityMedicine = params =>
  axios.post('/wechatActivityMedicine/api/saveWechatActivityMedicine', params)

/**
 * 活动药箱删除
 * @param {*} params
 */
export const deleteActivityMedicine = params =>
  axios.post('/wechatActivityMedicine/api/delWechatActivityMedicine', params)

/**
 * 活动药箱上架
 * @param {*} params
 */
export const putActivityMedicine = params =>
  axios.post('/wechatActivityMedicine/api/putWechatActivityMedicine', params)

/**
 * 活动药箱下架
 * @param {*} params
 */
export const offActivityMedicine = params =>
  axios.post('/wechatActivityMedicine/api/offWechatActivityMedicine', params)

/***************************
 ******** 药品列表接口 ******
 **************************/

/**
 * 商品分类列表获取
 * @param {*} params
 */
export const getDrugCategories = params =>
  axios.get('/wechatDrugInfo/query/getDrugClassification', params)

/***************************
 ******** 药品列表接口 ******
 **************************/

/**
 * 商品列表获取
 * @param {*} params
 */
export const getDrugs = params =>
  axios.get('/wechatDrugInfo/query/getWechatDrugInfoPage', params)
