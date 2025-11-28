import { defineStore } from 'pinia'
import { ApplicationSetting } from '../../../types'

type AppState = {
  settings: ApplicationSetting | null
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    settings: null
  }),
  getters: {},
  actions: {
    async boot() {
      this.settings = await window.api.loadSettings()
    }
  }
})
