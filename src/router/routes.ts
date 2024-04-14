export const docsRoutes = [
  {
    path: 'introduction/',
    name: 'docs-introduction',
    component: () => import('../pages/docs/template.vue'),
  },
  {
    path: 'about/',
    name: 'docs-about',
    component: () => import('../pages/docs/template.vue'),
  },
  {
    path: 'surl/api/',
    name: 'docs-surl-api',
    component: () => import('../pages/docs/template.vue'),
    meta: {
      cate: 'surl',
    },
  },
  {
    path: '',
    name: 'docs-default',
    redirect: {
      name: 'docs-introduction',
    },
    meta: {
      showInMenu: false,
    },
  },
];

export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/home.vue'),
  },
  {
    path: '/docs/',
    name: 'docs',
    component: () => import('../Layout.vue'),
    children: docsRoutes,
    meta: {
      showSider: true,
      a: 1,
    },
  },
];

export default routes;
