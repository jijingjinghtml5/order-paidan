import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/api_v3/app/site/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/api_v3/app/site/logout',
    method: 'post'
  })
}

export function loginByToken({ params }) {
  return request({
    url: '/api_v3/app/site/login-by-token',
    method: 'get',
    params
  })
}

export function loginBySSOToken(data) {
  return request({
    url: '/open-api/login-by-sso-token',
    method: 'post',
    data
  })
}

export function getCaseCount() {
  return request({
    url: '/api_v3/app/event/count',
    method: 'get'
  })
}
