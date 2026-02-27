import { defineStore } from 'pinia'
import { RemovableRef, useLocalStorage } from '@vueuse/core'
// TYPES
import { Activity, ActivityPhotos, ApplicationSetting } from '@types'
// UTILS
import { getActivitiesMaxDate } from '@renderer/utils'
// API
import { fetchActivities, fetchActivity, fetchActivityPhotos } from '@renderer/api/strava'
// STORES
import { useAuthStore } from '@renderer/stores/auth'
import { setI18nLanguage } from '@renderer/i18n'
import { PrimeVueConfiguration } from 'primevue/config'

type AppState = {
  settings: ApplicationSetting | null
  isFetching: boolean
  activities: Array<Activity>
  error: boolean
  darkMode: RemovableRef<boolean>
  availableLocales: Array<{ code: string; flag: string }>
  locale: RemovableRef<string>
  activitySortDirection: 'asc' | 'desc'
  activitySortField: string
  activitySortOptions: Array<{ label: string; value: string }>
}

const ACTIVITIES_PER_PAGE = 200
const PHOTO_SIZE = 2048
const MTB_SPORT_TYPE = 'MountainBikeRide'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    settings: null,
    isFetching: false,
    activities: [],
    error: false,
    darkMode: useLocalStorage('darkMode', false),
    availableLocales: [
      { code: 'en', flag: 'gb' },
      { code: 'it', flag: 'it' }
    ],
    locale: useLocalStorage('i18nLocale', ''),
    activitySortDirection: 'desc',
    activitySortField: 'start_date_local',
    activitySortOptions: [
      { label: 'DATE', value: 'start_date_local' },
      { label: 'DISTANCE', value: 'distance' },
      { label: 'DURATION', value: 'moving_time' },
      { label: 'DISTANCE', value: 'total_elevation_gain' },
      { label: 'SPEED', value: 'max_speed' }
    ]
  }),
  getters: {
    isSettingFilled: state =>
      Boolean(state.settings && state.settings.stravaClientId && state.settings.stravaClientSecret),
    totalTime: state => state.activities.reduce((acc, activity) => acc + activity.moving_time, 0),
    avgTime(state): number {
      return this.totalTime / state.activities.length
    },
    totalDistance: state => state.activities.reduce((acc, activity) => acc + activity.distance, 0),
    avgDistance(state): number {
      return this.totalDistance / state.activities.length
    },
    avgElevation: state =>
      state.activities.reduce((acc, activity) => acc + activity.total_elevation_gain, 0) / state.activities.length,
    maxElevation: state => Math.max(...state.activities.map(x => x.total_elevation_gain)),
    selectedActivitySortOption: state => state.activitySortOptions.find(x => x.value === state.activitySortField),
    availableLocalesCodes: state => state.availableLocales.map(x => x.code)
  },
  actions: {
    async readSettings() {
      this.settings = await window.api.readSettings()
    },
    async saveSettings(settings: Partial<ApplicationSetting>) {
      await window.api.writeSettings(settings)
    },
    reload() {
      window.api.reload()
    },
    async boot() {
      // const authStore = useAuthStore()
      // try {
      //   this.error = false
      //   await this.readSettings()
      //   await authStore.readAuthData()
      //   if (this.settings) {
      //     authStore.bindEvents(this.settings)
      //   }
      if (this.darkMode) {
        document.documentElement.classList.add('mtb-wise-dark')
      }
      //   await this.fetchData()
      // } catch (e) {
      //   this.error = true
      // }
    },
    setLocale(locale: string, pvConfig: { config: PrimeVueConfiguration }) {
      this.locale = locale
      setI18nLanguage(locale, pvConfig)
    },
    initLocale(pvConfig: { config: PrimeVueConfiguration }) {
      if (!this.locale) {
        const detectedLocale = navigator.languages[0].split('-')[0].toLowerCase()
        if (detectedLocale && this.availableLocalesCodes.includes(detectedLocale)) {
          this.locale = detectedLocale
        }
      }
      this.setLocale(this.locale, pvConfig)
    },
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      document.documentElement.classList.toggle('mtb-wise-dark')
    },
    async fetchActivities(page, after?: number) {
      const authStore = useAuthStore()
      await authStore.refreshToken()
      const fetchedActivities = await fetchActivities(page, ACTIVITIES_PER_PAGE, after)
      this.activities = [...this.activities, ...fetchedActivities.filter(x => x.sport_type === MTB_SPORT_TYPE)]
      if (fetchedActivities.length === ACTIVITIES_PER_PAGE) await this.fetchActivities(page + 1)
    },
    async fetchData() {
      try {
        this.isFetching = true
        this.activities = await window.api.readActivities()
        const lastActivityDate = getActivitiesMaxDate(this.activities)
        const after = lastActivityDate ? new Date(lastActivityDate).getTime() / 1000 : undefined
        await this.fetchActivities(1, after)
        await window.api.writeActivities(JSON.parse(JSON.stringify(this.activities)))
        this.isFetching = false
      } catch (e) {
        this.error = true
        this.isFetching = false
      }
    },
    async fetchActivity(id: string): Promise<Activity | null> {
      try {
        const authStore = useAuthStore()
        this.isFetching = true
        await authStore.refreshToken()
        const result = await fetchActivity(id)
        this.isFetching = false
        return result
      } catch (e) {
        this.isFetching = false
        return null
      }
    },
    async fetchActivityPhotos(id: string): Promise<Array<ActivityPhotos>> {
      try {
        const authStore = useAuthStore()
        this.isFetching = true
        await authStore.refreshToken()
        const result = await fetchActivityPhotos(id, PHOTO_SIZE)
        this.isFetching = false
        return result.map(x => ({ id: x.unique_id, url: x.urls[PHOTO_SIZE] }))
      } catch (e) {
        this.isFetching = false
        return []
      }
    },
    toggleActivitySortDirection() {
      if (this.activitySortDirection === 'asc') {
        this.activitySortDirection = 'desc'
      } else {
        this.activitySortDirection = 'asc'
      }
    },
    setActivitySortOption(label: string) {
      const option = this.activitySortOptions.find(x => x.label === label)
      if (option) {
        this.activitySortField = option.value
      }
    },
    showPhotos(id: string) {
      window.api.showPhotos(id)
    },
    showMap(id: string) {
      window.api.showMap(id)
    },
    showHelp() {
      window.api.showHelp()
    }
  }
})
