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

export function getReportTypes(params) {
  return request({
    url: '/api_v3/manage/meta-data/report-types',
    method: 'get',
    params
  })
}

export function getDiscoverTypes(params) {
  return request({
    url: '/api_v3/manage/meta-data/discover-types',
    method: 'get',
    params
  })
}

export function getCodeDict(params) {
  return request({
    url: '/api_v3/app/meta-data/code-dict',
    method: 'get',
    params
  })
}

export function getEventSource(params) {
  return request({
    url: '/api_v3/manage/meta-data/sources',
    method: 'get',
    params
  })
}

export function getAllEventTypes(params) {
  return request({
    url: '/api_v3/manage/meta-data/event-types',
    method: 'get',
    params
  })
}

export function getNewsCount(params) {
  return request({
    url: '/api_v3/app/notification-record/count',
    method: 'get',
    params
  })
}

export function getNewsRecords(params) {
  return request({
    url: '/api_v3/app/notification-records',
    method: 'get',
    params
  })
}
export function setNewsRead(data) {
  return request({
    url: '/api_v3/app/notification-record/switch',
    method: 'post',
    data
  })
}
