import { defineStore } from 'pinia'
import { RemovableRef, useLocalStorage } from '@vueuse/core'
import { ApplicationSetting } from 'src/types'
import { useAuthStore } from './auth'
import { fetchActivities } from '../api/strava'

type AppState = {
  settings: ApplicationSetting | null
  isFetching: boolean
  activities: Array<any>
  error: boolean
  darkMode: RemovableRef<boolean>
}

const ACTIVITIES_PER_PAGE = 50
const MTB_SPORT_TYPE = 'MountainBikeRide'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    settings: null,
    isFetching: false,
    activities: [],
    error: false,
    darkMode: useLocalStorage('darkMode', false)
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
    maxElevation: state => Math.max(...state.activities.map(x => x.total_elevation_gain))
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
    async fetchData(page = 1) {
      try {
        this.isFetching = true

        //START MOCK
        const data = await (await import('../assets/mock.json')).default
        setTimeout(() => {
          console.log('mock fetched')
          this.activities = data
          this.isFetching = false
        }, 1500)
        //END MOCK

        // const authStore = useAuthStore()
        // await authStore.refreshToken()
        // const fetchedActivities = await fetchActivities(page, ACTIVITIES_PER_PAGE)
        // this.activities = [...this.activities, ...fetchedActivities.filter(x => x.sport_type === MTB_SPORT_TYPE)]
        // if (fetchedActivities.length === ACTIVITIES_PER_PAGE) await this.fetchData(page + 1)
        // else this.isFetching = false
      } catch (e) {
        this.error = true
        this.isFetching = false
      }
    }
  }
})
