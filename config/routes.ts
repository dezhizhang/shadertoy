/*
 * :file description:
 * :name: /shadertoy/config/routes.ts
 * :author:张德志
 * :copyright: (c) 2025, Xiaozhi
 * :date created: 2025-01-07 23:28:56
 * :last editor: 张德志
 * :date last edited: 2025-01-16 05:44:38
 */
export default [
  {
    path: '/',
    name: '首页',
    routes: [
      {
        path: '/',
        redirect: '/cine-shader',
      },
      {
        path: '/cine-shader',
        component: '@/pages/cineShader'
      },
      {
        path: '/ftt3R7',
        component: '@/pages/ftt3R7'
      },
      {
        path:'/xccbrx',
        component:'@/pages/xccbrx'
      },
      {
        path:'/wldsrn',
        component:'@/pages/wldsrn'
      },
      {
        path:'/lscczl',
        component:'@/pages/lscczl'
      },
      {
        path:'/xsfgrn',
        component:'@/pages/xsfgrn'
      }
    ],
  },
];
