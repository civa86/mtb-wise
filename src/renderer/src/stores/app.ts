import { defineStore } from 'pinia'
import { RemovableRef, useLocalStorage } from '@vueuse/core'
// TYPES
import { ApplicationSetting } from 'src/types'
// UTILS
import { getActivitiesMaxDate } from '@renderer/utils'
// API
import { fetchActivities } from '@renderer/api/strava'
// STORES
import { useAuthStore } from '@renderer/stores/auth'

type AppState = {
  settings: ApplicationSetting | null
  isFetching: boolean
  activities: Array<any>
  error: boolean
  darkMode: RemovableRef<boolean>
  activitySortDirection: 'asc' | 'desc'
  activitySortField: string
  activitySortOptions: Array<{ label: string; value: string }>
}

const ACTIVITIES_PER_PAGE = 200
const MTB_SPORT_TYPE = 'MountainBikeRide'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    settings: null,
    isFetching: false,
    activities: [],
    error: false,
    darkMode: useLocalStorage('darkMode', false),
    activitySortDirection: 'desc',
    activitySortField: 'start_date_local',
    activitySortOptions: [
      { label: 'Date', value: 'start_date_local' },
      { label: 'Distance', value: 'distance' },
      { label: 'Duration', value: 'moving_time' },
      { label: 'Elevation', value: 'total_elevation_gain' },
      { label: 'Speed', value: 'max_speed' }
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
    selectedActivitySortOption: state => state.activitySortOptions.find(x => x.value === state.activitySortField)
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
      const authStore = useAuthStore()
      try {
        this.error = false
        await this.readSettings()
        await authStore.readAuthData()
        if (this.settings) {
          authStore.bindEvents(this.settings)
        }
        if (this.darkMode) {
          document.documentElement.classList.add('mtb-wise-dark')
        }
      } catch (e) {
        this.error = true
      }
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
    }
  }
})
