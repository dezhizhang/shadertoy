/*
 * :file description:
 * :name: /shadertoy/config/routes.ts
 * :author:张德志
 * :copyright: (c) 2025, Xiaozhi
 * :date created: 2025-01-07 23:28:56
 * :last editor: 张德志
 * :date last edited: 2025-01-07 23:36:06
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
        path:'/cine-shader',
        component:'@/pages/cineShader'
      }
    ],
  },
];