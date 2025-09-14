import type { CronField } from '../types/cron'
import { MONTH_OPTIONS, DAY_OF_WEEK_OPTIONS } from '../constants/cronOptions'

// Validate a cron expression format
export const validateCronExpression = (expression: string): boolean => {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5) return false
  
  // Basic validation for each field
  const patterns = [
    /^(\*|([0-5]?\d)(,([0-5]?\d))*|([0-5]?\d)-([0-5]?\d)|(\*\/\d+))$/, // minutes (0-59)
    /^(\*|([01]?\d|2[0-3])(,([01]?\d|2[0-3]))*|([01]?\d|2[0-3])-([01]?\d|2[0-3])|(\*\/\d+))$/, // hours (0-23)
    /^(\*|([1-9]|[12]\d|3[01])(,([1-9]|[12]\d|3[01]))*|([1-9]|[12]\d|3[01])-([1-9]|[12]\d|3[01])|(\*\/\d+))$/, // day of month (1-31)
    /^(\*|([1-9]|1[0-2])(,([1-9]|1[0-2]))*|([1-9]|1[0-2])-([1-9]|1[0-2])|(\*\/\d+))$/, // month (1-12)
    /^(\*|[0-6](,[0-6])*|[0-6]-[0-6]|(\*\/\d+))$/ // day of week (0-6)
  ]
  
  return parts.every((part, index) => patterns[index].test(part))
}

// Parse a cron expression string into CronField
export const parseCronExpression = (expression: string): CronField | null => {
  if (!validateCronExpression(expression)) return null
  
  const parts = expression.trim().split(/\s+/)
  return {
    minutes: parts[0],
    hours: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4]
  }
}

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