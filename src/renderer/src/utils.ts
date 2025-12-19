import { Activity } from '../../types'

export const objectToQueryString = (obj: Record<string, unknown>): string => {
  return Object.entries(obj)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}

export const getActivitiesMinDate = (activities: Array<Activity>): string =>
  activities.reduce((minDate, activity) => (activity.start_date < minDate ? activity.start_date : minDate), '')

export const getActivitiesMaxDate = (activities: Array<Activity>): string =>
  activities.reduce((maxDate, activity) => (activity.start_date > maxDate ? activity.start_date : maxDate), '')
