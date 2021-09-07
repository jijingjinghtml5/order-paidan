import Storage from 'good-storage'

const TokenKey = 'webToken'
const UserInfoKey = 'userInfo'

export function getToken() {
  return Storage.get(TokenKey)
}

export function setToken(token) {
  return Storage.set(TokenKey, token)
}

export function removeToken() {
  return Storage.remove(TokenKey)
}

export function getUserInfo() {
  return JSON.parse(Storage.get(UserInfoKey) || JSON.stringify({}))
}

export function setUserInfo(userInfo) {
  return Storage.set(UserInfoKey, JSON.stringify(userInfo))
}

export function removeUserInfo() {
  return Storage.remove(UserInfoKey)
}
