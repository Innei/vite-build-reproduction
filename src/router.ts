import { createRouter, createWebHashHistory } from 'vue-router'
import { RESTManager } from './utils/rest'
import PlaceHolderView from './views/empty'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: PlaceHolderView,

      redirect: '/dashboard',
    },

    {
      path: '/login',

      component: PlaceHolderView,
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.meta.isPublic) {
    return
  } else {
    // 在这里发送请求, 一般用于鉴权. 由于是复现, 随便用了接口请求
    const res = await RESTManager.api.users.octocat.repos.get()
    console.log(res)

    if (!res) {
      return '/login'
    }
  }
})

// router.afterEach((to, _) => {})
