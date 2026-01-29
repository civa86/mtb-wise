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

export type Activity = {
  id: number
  name: string
  distance: number
  moving_time: number
  elapsed_time: number
  achievement_count: number
  total_elevation_gain: number
  type: string
  sport_type: string
  start_date: string
  start_date_local: string
  timezone: string
  utc_offset: number
  average_speed: number
  max_speed: number
  elev_high: number
  elev_low: number
  total_photo_count: number
  start_latlng: Array<number>
  map: {
    polyline: string
  }
}

export type ActivityPhotosRaw = {
  unique_id: string
  urls: Record<string, string>
}

export type ActivityPhotos = {
  id: string
  url: string
}
