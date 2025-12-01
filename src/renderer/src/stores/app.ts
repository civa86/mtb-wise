import { defineStore } from 'pinia'
import { ApplicationSetting } from '../../../types'
import { useAuthStore } from './auth'

type AppState = {
  settings: ApplicationSetting | null
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    settings: null
  }),
  getters: {
    isSettingFilled: state =>
      Boolean(state.settings && state.settings.stravaClientId && state.settings.stravaClientSecret)
  },
  actions: {
    async boot() {
      const authStore = useAuthStore()
      this.settings = await window.api.loadSettings()

      window.api.onSetAuthorizationCode(value => {
        if (this.settings) {
          authStore.setAuthData(this.settings?.stravaClientId, this.settings?.stravaClientSecret, value)
        }
      })
    }
  }
})
