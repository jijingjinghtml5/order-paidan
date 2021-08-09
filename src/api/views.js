import request from '@/utils/request'

/**
 * 查询业务配置列表
 */
export function getManageBusinesss(params) {
  return request({
    url: '/api_v3/manage/businesss',
    method: 'get',
    params
  })
}

/**
 * 创建业务配置
 */
export function createManageBusinesss(data) {
  return request({
    url: '/api_v3/manage/businesss',
    method: 'post',
    data
  })
}

/**
 * 删除业务配置
 */
export function deleteManageBusinesss(data) {
  return request({
    url: `/api_v3/manage/businesss/${data.id}`,
    method: 'delete'
  })
}

/**
 * 查看业务配置
 */
export function showManageBusinesss(data) {
  return request({
    url: `/api_v3/manage/businesss/${data.id}`,
    method: 'get'
  })
}

/**
 * 编辑业务配置
 */
export function editManageBusinesss(data) {
  return request({
    url: `/api_v3/manage/businesss/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 查询上报方式下拉
 */
export function getReportTypes(params) {
  return request({
    url: '/api_v3/manage/meta-data/report-types',
    method: 'get',
    params
  })
}

/**
 * 查询发现方式下拉
 */
export function getDiscoverTypes(params) {
  return request({
    url: '/api_v3/manage/meta-data/discover-types',
    method: 'get',
    params
  })
}

/**
 * 查询案件分类下拉
 */
export function getEventTypes(params) {
  return request({
    url: '/api_v3/manage/meta-data/event-types',
    method: 'get',
    params
  })
}

/**
 * 查询案件分类下拉
 */
export function getSourcesTypes(params) {
  return request({
    url: '/api_v3/manage/meta-data/sources',
    method: 'get',
    params
  })
}
