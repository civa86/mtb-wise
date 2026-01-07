import {
  createRouter,
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
  createWebHashHistory
} from 'vue-router'
// STORES
import { useAppStore } from '@renderer/stores/app'
import { useAuthStore } from '@renderer/stores/auth'

const init = async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const appStore = useAppStore()
  const authStore = useAuthStore()
  if (to.name !== 'settings') {
    if (!appStore.isSettingFilled) {
      return next({ name: 'settings' })
    } else if (!authStore.isAuthFilled) {
      authStore.authorize(appStore.settings?.stravaClientId as string, appStore.settings?.stravaRedirectURI as string)
    }
  }
  return next()
}

const routes: Array<RouteRecordRaw> = [
  {
    name: 'main',
    path: '/',
    component: () => import('../views/Main.vue'),
    children: [
      {
        name: 'home',
        path: '',
        redirect: () => ({ name: 'statistics' })
      },
      {
        name: 'statistics',
        path: 'statistics',
        component: () => import('../views/Statistics.vue')
      },
      {
        name: 'activities',
        path: 'activities',
        component: () => import('../views/Activities.vue')
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../views/Settings.vue')
      }
    ]
  },
  {
    name: 'catchAll',
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(init)

export default router
