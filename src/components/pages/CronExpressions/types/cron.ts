export interface CronField {
  seconds?: string
  minutes: string
  hours: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

export interface CronOption {
  value: string
  label: string
}

export interface CommonCronExpression {
  name: string
  cron: string
  desc: string
} 