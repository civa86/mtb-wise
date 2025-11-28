import {
  createRouter,
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext,
  createWebHistory
} from 'vue-router'
import { useAppStore } from '../stores/app'

const init = async (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  //   const locale = to.params.locale as string
  const appStore = useAppStore()
  console.log(appStore.settings)
  //   if (locale) {
  //     const availableLocales = appStore.settings?.i18n.availableLocales.map(l => l.locale) || []
  //     const additionalMessages =
  //       appStore.settings?.i18n.messages && appStore.settings?.i18n.messages[locale]
  //         ? appStore.settings?.i18n.messages[locale]
  //         : {}
  //     if (!availableLocales.includes(locale)) {
  //       return next({ name: 'void_entry' })
  //     }
  //     await loadLocaleMessages(locale, additionalMessages)
  //     setI18nLanguage(locale)
  //   }

  //   const authStore = useAuthStore()
  //   authStore.initProvider()
  //   await authStore.checkUser()

  //   const socketStore = useSocketStore()
  //   socketStore.reconnect()

  //   if (to.meta && to.meta.requireAuth === true && !authStore.isAuthenticated) {
  //     authStore.refferer = to
  //     return next({ name: 'login', params: { locale: to.params.locale } })
  //   }

  //   if (to.name === 'login' && authStore.isAuthenticated) return next({ name: 'void_entry' })

  //   const allowedRoles = (to.meta?.allowedRoles as Array<string>) || null

  //   if (Array.isArray(allowedRoles) && !authStore.userGroups.some(g => allowedRoles.includes(g)))
  //     return next({ name: 'void_entry' })

  //   if (appStore.notifications[to.name as string]) appStore.resetNotifications(to.name as string)

  return next()
}

const routes: Array<RouteRecordRaw> = [
  {
    name: 'main',
    path: '/',
    component: () => import('../views/Main.vue')
  },
  {
    name: 'catchAll',
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(init)

export default router
