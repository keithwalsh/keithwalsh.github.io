import { getDescription } from 'cron-descriptor'
import type { CronField } from '../types/cron'

// Validate a cron expression format (supports both 5 and 6 field expressions)
export const validateCronExpression = (expression: string): boolean => {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== 5 && parts.length !== 6) return false
  
  // Extended validation patterns that support ranges, steps, range with steps, lists with ranges, and question marks
  const patterns = [
    /^(\*|([0-5]?\d)(,([0-5]?\d|-)*)*|([0-5]?\d)-([0-5]?\d)|(\*\/\d+)|(\d+\/\d+)|(([0-5]?\d)-([0-5]?\d)\/\d+))$/, // seconds (0-59) - for 6-field
    /^(\*|([0-5]?\d)(,([0-5]?\d|-)*)*|([0-5]?\d)-([0-5]?\d)|(\*\/\d+)|(\d+\/\d+)|(([0-5]?\d)-([0-5]?\d)\/\d+))$/, // minutes (0-59)
    /^(\*|([01]?\d|2[0-3])(,([01]?\d|2[0-3]|-)*)*|([01]?\d|2[0-3])-([01]?\d|2[0-3])|(\*\/\d+)|(\d+\/\d+)|(([01]?\d|2[0-3])-([01]?\d|2[0-3])\/\d+))$/, // hours (0-23)
    /^(\*|\?|([1-9]|[12]\d|3[01])(,([1-9]|[12]\d|3[01]|-)*)*|([1-9]|[12]\d|3[01])-([1-9]|[12]\d|3[01])|(\*\/\d+)|(\d+\/\d+)|(([1-9]|[12]\d|3[01])-([1-9]|[12]\d|3[01])\/\d+))$/, // day of month (1-31) - supports ?
    /^(\*|([1-9]|1[0-2])(,([1-9]|1[0-2]|-)*)*|([1-9]|1[0-2])-([1-9]|1[0-2])|(\*\/\d+)|(\d+\/\d+)|(([1-9]|1[0-2])-([1-9]|1[0-2])\/\d+))$/, // month (1-12)
    /^(\*|\?|[0-6](,[0-6])*|[0-6]-[0-6]|(\*\/\d+)|(\d+\/\d+)|([0-6]-[0-6]\/\d+))$/ // day of week (0-6) - supports ?
  ]
  
  // For 5-field expressions, skip the seconds pattern
  const startIndex = parts.length === 6 ? 0 : 1
  const relevantPatterns = patterns.slice(startIndex)
  
  return parts.every((part, index) => relevantPatterns[index].test(part))
}

// Get ordinal suffix for a number (1st, 2nd, 3rd, 4th, etc.)
export const getOrdinalSuffix = (num: string): string => {
  const n = parseInt(num, 10)
  
  if (isNaN(n)) return ''
  
  const j = n % 10
  const k = n % 100
  
  if (j === 1 && k !== 11) {
    return 'st'
  }
  if (j === 2 && k !== 12) {
    return 'nd'
  }
  if (j === 3 && k !== 13) {
    return 'rd'
  }
  return 'th'
}

// Parse a cron expression string into CronField
export const parseCronExpression = (expression: string): CronField | null => {
  if (!validateCronExpression(expression)) return null
  
  const parts = expression.trim().split(/\s+/)
  
  if (parts.length === 6) {
    return {
      seconds: parts[0],
      minutes: parts[1],
      hours: parts[2],
      dayOfMonth: parts[3],
      month: parts[4],
      dayOfWeek: parts[5]
    }
  } else {
    return {
      minutes: parts[0],
      hours: parts[1],
      dayOfMonth: parts[2],
      month: parts[3],
      dayOfWeek: parts[4]
    }
  }
}






// Generate description for cron expression using cron-descriptor library
export const generateDescription = (fields: CronField): string => {
  try {
    // Convert CronField to cron expression string
    const cronExpression = fields.seconds 
      ? `${fields.seconds} ${fields.minutes} ${fields.hours} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`
      : `${fields.minutes} ${fields.hours} ${fields.dayOfMonth} ${fields.month} ${fields.dayOfWeek}`
    
    // Use cron-descriptor library to generate human-readable description
    const description = getDescription(cronExpression, {
      use24hourTimeFormat: false,
      verbose: true,
      dayOfWeekStartIndexZero: true
    })
    
    // Remove leading zeros from time format (e.g., "03:00 PM" -> "3:00 PM")
    return description
      .replace(/0([0-9]{1}:[0-9]{2} )(A|P)(M)/g, '$1$2$3')
      .replace(/(on )(day )([0-9]{1,2})/g, (_, prefix, __, dayNumber) => 
        `${prefix}the ${dayNumber}${getOrdinalSuffix(dayNumber)}`
      )
      .replace(/(Every minute, )(every hour, )/g, '$1')
      .replace(/(Every minute, )(every day, )/g, '$1')
      .replace(/(Every minute)(, )(every day)/g, '$1')
  } catch (error) {
    console.error('Error generating cron description:', error)
    return 'Invalid cron expression'
  }
} 