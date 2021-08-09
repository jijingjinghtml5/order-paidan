// 界面配置相关接口
import request from '@/utils/request'

// 提交菜单配置
export function setAssembles(id, data) {
  return request({
    url: `/api_v3/manage/assembles/${id}`,
    method: 'put',
    data
  })
}
// 查看菜单
export function getAssembles(params) {
  return request({
    url: '/api_v3/manage/assembles',
    method: 'get',
    params
  })
}
