import Layout from '@/layout'
import Nested from '@/layout/nested.vue'

const dictionaryRouter = {
  path: '/dictionary',
  component: Layout,
  name: 'Dictionary',
  redirect: '/dictionary/status',
  meta: {
    title: '字典管理',
    icon: 'dictionary',
    roles: ['admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'status',
      component: () => import('@/views/case-status/index'),
      name: 'Status',
      meta: { title: '案件状态' }
    },
    {
      path: 'stage',
      component: () => import('@/views/case-stage/index'),
      name: 'Stage',
      meta: { title: '案件阶段' }
    },
    {
      path: 'operation',
      component: Nested,
      name: 'Operation',
      redirect: 'operation/transfer',
      meta: { title: '案件操作' },
      children: [
        {
          path: 'transfer',
          component: () => import('@/views/case-operation/transfer'),
          name: 'Transfer',
          meta: { title: '流转操作' }
        },
        {
          path: 'builtIn',
          component: () => import('@/views/case-operation/built-in'),
          name: 'BuiltIn',
          meta: { title: '系统内置' }
        },
        {
          path: 'label',
          component: () => import('@/views/case-operation/label'),
          name: 'OperLabel',
          meta: { title: '标签操作' }
        }
      ]
    },
    {
      path: 'label',
      component: () => import('@/views/case-label/index'),
      name: 'Label',
      meta: { title: '案件标签' }
    },
    {
      path: 'menu',
      component: () => import('@/views/case-menu/index'),
      name: 'Menu',
      meta: { title: '系统菜单' }
    }
  ]
}

export default dictionaryRouter
