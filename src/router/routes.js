
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      {
        path: 'account/login',
        name: 'login',
        component: () => import('pages/account/Login.vue')
      },
      {
        path: 'account/register',
        name: 'registration',
        component: () => import('pages/account/Register.vue')
      },
      {
        path: 'account/registered',
        name: 'registered',
        meta: { authRequired: true },
        component: () => import('pages/account/Registered.vue')
      },
      {
        path: '/state-names',
        meta: { authRequired: true },
        component: () => import('pages/StateNames.vue')
      },
      {
        path: '/titles',
        meta: { authRequired: true },
        component: () => import('pages/Titles.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
