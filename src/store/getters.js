const getters = {
  token: (state) => state.user.token,
  userInfo: (state) => state.user.userInfo,
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  avatar: (state) => state.user.avatar,
  roles: (state) => state.user.roles,
  menus: (state) => state.user.menus,
  permission_routes: (state) => state.permission.routes,
  cachedViews: (state) => state.tagsView.cachedViews,
  visitedViews: (state) => state.tagsView.visitedViews,
  eventType: (state) => state.common.eventType,
  eventTypeNew: (state) => state.common.eventTypeNew,
  eventSource: (state) => state.common.eventSource,
  codeDict: (state) => state.common.codeDict,
  reportTypes: (state) => state.common.reportTypes,
  discoverTypes: (state) => state.common.discoverTypes,
  caseStatus: (state) => state.common.caseStatus,
  casePeriod: (state) => state.common.casePeriod,
  caseOperation: (state) => state.common.caseOperation
}
export default getters
