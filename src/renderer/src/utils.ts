import { Activity } from '../../types'

export const objectToQueryString = (obj: Record<string, unknown>): string => {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}

export const getActivitiesMinDate = (activities: Array<Activity>): string =>
  activities
    .map(x => x.start_date)
    .sort()
    .shift() as string

export const getActivitiesMaxDate = (activities: Array<Activity>): string =>
  activities
    .map(x => x.start_date)
    .sort()
    .pop() as string

export const secondsToHHMMSS = (seconds: number): Array<number> => {
  const hh = Math.floor(seconds / 3600)
  const mm = Math.floor((seconds - hh * 3600) / 60)
  const ss = Math.floor(seconds - hh * 3600 - mm * 60)
  return [hh, mm, ss]
}

export const formatActivityDate = (date: string): string => {
  const d = new Date(date)
  return d.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const msToKmh = (ms: number): number => ms * 3.6
