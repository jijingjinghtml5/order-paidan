// 系统菜单相关接口
import request from '@/utils/request'

// 提交菜单配置
export function setMenusConfig(data) {
  return request({
    url: '/api_v3/manage/menus-config',
    method: 'post',
    data
  })
}
// 查看菜单
export function getMenusConfig(params) {
  return request({
    url: '/api_v3/manage/menus-config',
    method: 'get',
    params
  })
}
