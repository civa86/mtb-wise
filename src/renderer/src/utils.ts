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
