import type { CronField } from '../types/cron'
import { MONTH_OPTIONS, DAY_OF_WEEK_OPTIONS } from '../constants/cronOptions'

// Generate description for cron expression
export const generateDescription = (fields: CronField): string => {
  let desc = 'Runs '
  
  // Frequency
  if (fields.minutes === '*' && fields.hours === '*') {
    desc += 'every minute'
  } else if (fields.minutes !== '*' && fields.hours === '*') {
    desc += `at minute ${fields.minutes} of every hour`
  } else if (fields.minutes === '*' && fields.hours !== '*') {
    desc += `every minute during hour ${fields.hours}`
  } else if (fields.minutes !== '*' && fields.hours !== '*') {
    desc += `at ${fields.hours.padStart(2, '0')}:${fields.minutes.padStart(2, '0')}`
  }

  // Day of month
  if (fields.dayOfMonth !== '*') {
    desc += ` on day ${fields.dayOfMonth} of the month`
  }

  // Month
  if (fields.month !== '*') {
    const monthName = MONTH_OPTIONS.find(m => m.value === fields.month)?.label
    desc += ` in ${monthName}`
  }

  // Day of week
  if (fields.dayOfWeek !== '*') {
    const dayName = DAY_OF_WEEK_OPTIONS.find(d => d.value === fields.dayOfWeek)?.label
    desc += ` on ${dayName}s`
  }

  return desc
} 