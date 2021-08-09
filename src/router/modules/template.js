import Layout from '@/layout'

const templateRouter = {
  path: '/template',
  component: Layout,
  name: 'Template',
  redirect: '/Template/card',
  meta: {
    title: '模板管理',
    icon: 'template',
    roles: ['admin'] // you can set roles in root nav
  },
  children: [
    {
      path: 'card',
      component: () => import('@/views/template-card/index'),
      name: 'Card',
      meta: { title: '案件卡片' }
    },
    {
      path: 'card-detail',
      component: () => import('@/views/template-card/detail'),
      name: 'CardDetail',
      hidden: true,
      meta: { title: '案件卡片-详情', activeMenu: '/template/card' }
    },
    {
      path: 'detail',
      component: () => import('@/views/template-detail/index'),
      name: 'Detail',
      meta: { title: '案件详情' }
    },
    {
      path: 'detail-detail',
      component: () => import('@/views/template-detail/detail'),
      name: 'DetailDetail',
      hidden: true,
      meta: { title: '案件详情-详情', activeMenu: '/template/detail' }
    },
    {
      path: 'search',
      component: () => import('@/views/template-search/index'),
      name: 'Search',
      meta: { title: '案件筛选' }
    },
    {
      path: 'search-detail',
      component: () => import('@/views/template-search/detail'),
      name: 'SearchDetail',
      hidden: true,
      meta: { title: '案件筛选-详情', activeMenu: '/template/search' }
    },
    {
      path: 'sort',
      component: () => import('@/views/template-sort/index'),
      name: 'Sort',
      meta: { title: '案件排序' }
    },
    {
      path: 'sort-detail',
      component: () => import('@/views/template-sort/detail'),
      name: 'SortDetail',
      hidden: true,
      meta: { title: '案件排序-详情', activeMenu: '/template/sort' }
    },
    {
      path: 'print',
      component: () => import('@/views/template-print/index'),
      name: 'Print',
      meta: { title: '案件打印' }
    },
    {
      path: 'print-detail',
      component: () => import('@/views/template-print/detail'),
      name: 'PrintDetail',
      hidden: true,
      meta: { title: '案件打印-详情', activeMenu: '/template/print' }
    }
  ]
}

export default templateRouter
