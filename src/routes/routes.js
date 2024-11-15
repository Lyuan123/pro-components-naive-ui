export const zhDocRoutes = [
  {
    path: 'introduction',
    component: () => import('../pages/docs/introduction/zhCN/index.md'),
  },
]

export const zhComponentRoutes = [
  {
    path: 'card',
    component: () => import('../../packages/components/src/card/demos/zhCN/index.demo-entry.md'),
  },
  {
    path: 'modal',
    component: () => import('../../packages/components/src/modal/demos/zhCN/index.demo-entry.md'),
  },
  {
    path: 'descriptions',
    component: () => import('../../packages/components/src/descriptions/demos/zhCN/index.demo-entry.md'),
  },
  {
    path: 'button',
    component: () => import('../../packages/components/src/button/demos/zhCN/index.demo-entry.md'),
  },
  {
    path: 'tree',
    component: () => import('../../packages/components/src/tree/demos/zhCN/index.demo-entry.md'),
  },
  {
    path: 'form',
    component: () => import('../../packages/components/src/form/demos/zhCN/index.demo-entry.md'),
  },
  {
    path: 'field',
    component: () => import('../../packages/components/src/form/components/demos/zhCN/index.demo-entry.md'),
  },
  {
    path: 'field-dependency',
    component: () => import('../../packages/components/src/form/demos/zhCN/dependency.demo-entry.md'),
  },
  {
    path: 'form-list',
    component: () => import('../../packages/components/src/form-list/demos/zhCN/index.demo-entry.md'),
  },
  {
    path: 'search-form',
    component: () => import('../../packages/components/src/data-table/components/search-form/demos/zhCN/index.demo-entry.md'),
  },
  {
    path: 'data-table',
    component: () => import('../../packages/components/src/data-table/demos/zhCN/index.demo-entry.md'),
  },
  {
    path: 'edit-data-table',
    component: () => import('../../packages/components/src/edit-data-table/demos/zhCN/index.demo-entry.md'),
  },
]

export const routes = [
  {
    name: 'home',
    path: '/:lang/:theme',
    component: () => import('../pages/home/index.vue'),
  },
  {
    name: 'zhDocs',
    path: '/zh-CN/:theme/docs',
    component: () => import('../pages/Layout.vue'),
    children: zhDocRoutes,
  },
  {
    name: 'zhComponents',
    path: '/zh-CN/:theme/components',
    component: () => import('../pages/Layout.vue'),
    children: zhComponentRoutes,
  },
  {
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    redirect: {
      name: 'home',
      params: {
        lang: 'zh-CN',
        theme: 'os-theme',
      },
    },
  },
]
