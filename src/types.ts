export type ApplicationSetting = {
  stravaClientId: string
  stravaClientSecret: string
  stravaRedirectURI: string
  maintenanceHours: number
  lastMaintenance: number | null
}

export type AuthData = {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresAt: number
}

export type StravaTokenResponse = {
  access_token: string
  refresh_token: string
  token_type: string
  expires_at: number
}
