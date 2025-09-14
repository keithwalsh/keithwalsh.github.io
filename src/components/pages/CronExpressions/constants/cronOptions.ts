import type { CronOption } from '../types/cron'

export const MONTH_OPTIONS: CronOption[] = [
  { value: '*', label: 'All' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' }
]

export const DAY_OF_WEEK_OPTIONS: CronOption[] = [
  { value: '*', label: 'All' },
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' }
]

export const generateTimeOptions = (start: number, end: number, prefix: string = ''): CronOption[] => {
  const options: CronOption[] = [{ value: '*', label: 'All' }]
  for (let i = start; i <= end; i++) {
    options.push({ value: i.toString(), label: `${prefix}${i}` })
  }
  return options
}

export const MINUTE_OPTIONS = generateTimeOptions(0, 59)
export const HOUR_OPTIONS = generateTimeOptions(0, 23)
export const DAY_OPTIONS = generateTimeOptions(1, 31) 