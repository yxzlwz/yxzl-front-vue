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
