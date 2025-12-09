import { defineStore } from 'pinia'
import { ApplicationSetting } from 'src/types'
import { useAuthStore } from './auth'

type AppState = {
  settings: ApplicationSetting | null
  isFetching: boolean
  error: boolean
}

const ACTIVITIES_PER_PAGE = 200
const MTB_SPORT_TYPE = 'MountainBikeRide'

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    settings: null,
    isFetching: false,
    error: false
  }),
  getters: {
    isSettingFilled: state =>
      Boolean(state.settings && state.settings.stravaClientId && state.settings.stravaClientSecret)
  },
  actions: {
    async readSettings() {
      try {
        this.error = false
        this.settings = await window.api.readSettings()
      } catch (e) {
        this.error = true
      }
    },
    async saveSettings(settings: Partial<ApplicationSetting>) {
      try {
        this.error = false
        const result = await window.api.writeSettings(settings)
        if (!result) this.error = true
      } catch (e) {
        this.error = true
      }
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
      } catch (e) {
        this.error = true
      }
    },
    /**
     * Refreshes the Strava token if it is no longer valid.
     * Checks if the token is still valid, otherwise requests a new one.
     */
    async fetchData() {
      try {
        this.isFetching = true
        const authStore = useAuthStore()
        await authStore.refreshToken()
      } catch (e) {
        this.error = true
      } finally {
        this.isFetching = false
      }
    }
  }
})
