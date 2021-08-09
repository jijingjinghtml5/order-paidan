import Layout from '@/layout'

const viewRouter = {
  path: '/view',
  component: Layout,
  name: 'View',
  redirect: '/view/config',
  meta: {
    title: '界面配置',
    icon: 'view',
    roles: ['admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'config',
      component: () => import('@/views/view-config/index'),
      name: 'Config',
      meta: { title: '界面配置' }
    },
    {
      path: 'service',
      component: () => import('@/views/view-service/index'),
      name: 'Service',
      meta: { title: '业务配置' }
    }
    // {
    //   path: 'interface',
    //   component: () => import('@/views/view-interface/index'),
    //   name: 'Interface',
    //   meta: { title: '配置接口' }
    // }
  ]
}

export default viewRouter
