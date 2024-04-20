export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/home.vue'),
  },
  {
    path: '/docs/:name/',
    name: 'docs',
    component: () => import('../pages/docs.vue'),
    meta: {
      showSider: true,
    },
  },
  {
    path: '/user/login/',
    name: 'user-login',
    component: () => import('../pages/user/login.vue'),
    meta: {
      // showSider: true,
    },
  },
  {
    path: '/user/center/',
    name: 'user-center',
    component: () => import('../pages/user/center.vue'),
    meta: {
      // showSider: true,
    },
  },
  {
    path: '/surl/create/',
    name: 'surl-create',
    component: () => import('../pages/surl/create.vue'),
    meta: {
      showSider: true,
    },
  },
  {
    path: '/surl/list/',
    name: 'surl-list',
    component: () => import('../pages/surl/list.vue'),
    meta: {
      showSider: true,
      requiredLogin: true,
    },
  },
  {
    path: '/yiyan/show/',
    name: 'yiyan-show',
    component: () => import('../pages/yiyan/show.vue'),
    meta: {
      showSider: true,
    },
  },
  {
    path: '/yiyan/create/',
    name: 'yiyan-create',
    component: () => import('../pages/yiyan/create.vue'),
    meta: {
      showSider: true,
    },
  },
  {
    path: '/yiyan/list/',
    name: 'yiyan-list',
    component: () => import('../pages/yiyan/list.vue'),
    meta: {
      showSider: true,
    },
  },
  {
    path: '/docs/',
    name: 'docs-default',
    redirect: {
      name: 'docs',
      params: {
        name: 'introduction',
      },
    },
  },
];

export default routes;
