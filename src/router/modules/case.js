// // 通用列表
// {
//   path: "/",
//   name: "case",
//   component: Layout,
//   children: [
//     {
//       path: "/list/:id",
//       name: "list",
//       component: () => import("@/views/list/index"),
//     },
//   ],
// },

import Layout from '@/layout'

const caseRouter = {
  path: '/',
  component: Layout,
  name: 'Case',
  // meta: {
  //   title: '界面配置',
  //   icon: 'view',
  //   roles: ['admin'] // you can set roles in root nav
  // },
  children: [
    {
      path: '/list/:id',
      name: 'list',
      component: () => import('@/views/list/index')
    },
    {
      path: '/case-detail-new/:id',
      name: 'case-detail-new',
      component: () => import('@/views/detail-info/detail-new.vue'),
      meta: {
        title: '案件详情'
      }
    }
  ]
}

export default caseRouter
