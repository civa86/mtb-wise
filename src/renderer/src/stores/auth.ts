import { defineStore } from 'pinia'
import { ApplicationSetting, AuthData, StravaTokenResponse } from '../../../types'
import { getAuthorizationURL, getToken, refreshToken } from '../api/strava'
import { useAppStore } from './app'

type AuthState = {
  authData: AuthData | null
  isAuthorizing: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    authData: null,
    isAuthorizing: false
  }),
  getters: {
    isAuthFilled: state => Boolean(state.authData && state.authData.accessToken && state.authData.refreshToken)
  },
  actions: {
    bindEvents(settings: ApplicationSetting) {
      window.api.onSetAuthorizationCode(async value => {
        const data = await getToken(settings.stravaClientId, settings.stravaClientSecret, value)
        await this.writeAuthData(data)
        await this.readAuthData()
        this.isAuthorizing = false
      })
    },
    authorize(clientId: string, redirectURI: string) {
      this.isAuthorizing = true
      window.api.authorize(getAuthorizationURL(clientId, redirectURI))
    },
    async readAuthData() {
      const appStore = useAppStore()
      try {
        appStore.error = false
        this.authData = await window.api.readAuthData()
      } catch (e) {
        appStore.error = true
      }
    },
    async writeAuthData(data: StravaTokenResponse) {
      const appStore = useAppStore()
      try {
        appStore.error = false
        const payload = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          tokenType: data.token_type,
          expiresAt: data.expires_at
        }
        const result = await window.api.writeAuthData(payload)
        if (!result) appStore.error = true
      } catch (e) {
        console.error(e)
        appStore.error = true
      }
    },
    async refreshToken() {
      const appStore = useAppStore()
      try {
        if (this.authData && appStore.settings) {
          const now = Date.now()
          if (this.authData.expiresAt * 1000 > now - 5 * 60 * 1000) return // Token is still valid
          const data = await refreshToken(
            appStore.settings.stravaClientId,
            appStore.settings.stravaClientSecret,
            this.authData.refreshToken
          )
          await this.writeAuthData(data)
          await this.readAuthData()
        }
      } catch (e) {
        if (appStore.settings) {
          this.authorize(appStore.settings.stravaClientId as string, appStore.settings.stravaRedirectURI as string)
        } else {
          appStore.error = true
        }
      }
    }
  }
})
