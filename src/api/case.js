import request from '@/utils/request'
/**
 * 查询字典
 * @param  {string}  type 1：阶段，2：状态，3：系统内置操作，4：操作，5：卡片，6：详情，7：打印，8: 菜单， 9：标签页，10：筛选，11：排序, 12：标签操作, 13：标签
 * @param  {string}  page
 * @param  {string}  pageSize
 */
export function getManageElements(params) {
  return request({
    url: '/api_v3/manage/elements',
    method: 'get',
    params
  })
}

/**
 * 创建字典、模板
 * @param  {string}  type 1：阶段，2：状态，3：系统内置操作，4：操作，5：卡片，6：详情，7：打印，9：标签页，10：筛选，11：排序
 * @param  {string}  name
 */
export function createManageElement(data) {
  return request({
    url: '/api_v3/manage/elements',
    method: 'post',
    data
  })
}

/**
 * 删除字典、模型
 */
export function deleteManageElement(data) {
  return request({
    url: `/api_v3/manage/elements/${data.id}`,
    method: 'delete'
  })
}

/**
 * 启用/禁用字典、模型
 */
export function changeManageElementStatus(data) {
  return request({
    url: `/api_v3/manage/elements/${data.id}`,
    method: 'patch'
  })
}

/**
 * 查看字典、模板
 */
export function getManageElementItem(data) {
  return request({
    url: `/api_v3/manage/elements/${data.id}`,
    method: 'get'
  })
}

/**
 * 编辑字典、模板
 * @param {string} name 名称
 */
export function editManageElementItem(data) {
  return request({
    url: `/api_v3/manage/elements/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 案件列表
 * @param {number} menuId 列表id
 */
export function getEvents(params) {
  return request({
    url: `/api_v3/app/events`,
    method: 'get',
    params
  })
}

/**
 * @param {string} parent_code
 */
export function getChildMeta(params) {
  return request({
    url: `/api_v3/manage/meta/child-meta`,
    method: 'get',
    params
  })
}

export function getDepsByParent(params) {
  return request({
    url: `/api_v3/manage/meta/deps-by-parent`,
    method: 'get',
    params
  })
}

export function getParents(params) {
  return request({
    url: `/api_v3/manage/meta/parents`,
    method: 'get',
    params
  })
}

export function getUsers(params) {
  return request({
    url: `/api_v3/app/meta-data/users`,
    method: 'get',
    params
  })
}

export function handleCaseDispatch(data) {
  return request({
    url: `/api_v3/app/event/dispatch`,
    method: 'post',
    data
  })
}

export function getEventDetail(eventId, params) {
  return request({
    url: `/api_v3/app/events/${eventId}`,
    method: 'get',
    params
  })
}

// 获取案件名称
export function getEventTypeDict(params) {
  return request({
    url: `${process.env.VUE_APP_LIST_URL}/meta-data/event-type-dict`,
    method: 'get',
    params
  })
}

// 根据坐标反查地址详细信息
export function getInfoByCoord(params) {
  return request({
    url: `${process.env.VUE_APP_LIST_URL}/meta-data/info-by-coord`,
    method: 'get',
    params
  })
}

// 获取案件锁的状态
export function getLock(params) {
  return request({
    url: `/api_v3/app/event/get-lock`,
    method: 'get',
    params
  })
}

// 案件标签
export function addEventTag(data) {
  return request({
    url: `/api_v3/app/event/add-tag`,
    method: 'post',
    data
  })
}
