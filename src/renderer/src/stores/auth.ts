import { defineStore } from 'pinia'
import axios from 'axios'

type AuthData = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_at: number
  expires_in: number
}

type AuthState = {
  authData: AuthData | null
  isAuthorizing: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    authData: null,
    isAuthorizing: false
  }),
  getters: {},
  actions: {
    authorize(clientId: string) {
      this.isAuthorizing = true
      window.api.authorize(clientId) //TODO calculate here url....centralize a file for strava api logic
    },
    async setAuthData(clientId: string, clientSecret: string, code: string) {
      const { data } = await axios.post(
        `https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code`
      )
      this.authData = data
      this.isAuthorizing = false
    }
  }
})
