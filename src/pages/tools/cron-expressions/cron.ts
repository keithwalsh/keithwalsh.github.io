import { DescriptionType, ExpressionDescriptor } from "cron-descriptor"

export type CronFieldKey =
  "minutes" | "hours" | "dayOfMonth" | "month" | "dayOfWeek"

export type CronFields = Record<CronFieldKey, string>

/** How the field editor presents a value. Always derived from the value. */
export type FieldMode = "every" | "step" | "specific" | "range"

export type CronField = {
  key: CronFieldKey
  label: string
  short: string
  min: number
  max: number
  unit: string
  unitPlural: string
  steps: number[]
  rangeDefault: string
  /** Display names for the field's values, starting at `min`. */
  names?: string[]
  details: string
  examples: [code: string, meaning: string][]
}

export const FIELD_KEYS: CronFieldKey[] = [
  "minutes",
  "hours",
  "dayOfMonth",
  "month",
  "dayOfWeek",
]

export const DEFAULT_FIELDS: CronFields = {
  minutes: "*",
  hours: "*",
  dayOfMonth: "*",
  month: "*",
  dayOfWeek: "*",
}

export const CRON_FIELDS: Record<CronFieldKey, CronField> = {
  minutes: {
    key: "minutes",
    label: "Minutes",
    short: "min",
    min: 0,
    max: 59,
    unit: "minute",
    unitPlural: "minutes",
    steps: [2, 5, 10, 15, 20, 30],
    rangeDefault: "0-15",
    details:
      "Controls which minute(s) of the hour the task will run. You can specify exact minutes, ranges, lists, or use step values to run at regular intervals throughout the hour.",
    examples: [
      ["0", "Run at the top of the hour (minute 0)"],
      ["15", "Run at 15 minutes past the hour"],
      ["*/5", "Run every 5 minutes"],
      ["0,20,40", "Run at 0, 20 and 40 minutes past the hour"],
      ["10-20", "Run at minutes 10 through 20"],
    ],
  },
  hours: {
    key: "hours",
    label: "Hours",
    short: "hour",
    min: 0,
    max: 23,
    unit: "hour",
    unitPlural: "hours",
    steps: [2, 3, 4, 6, 8, 12],
    rangeDefault: "9-17",
    details:
      "Specifies which hour(s) of the day the task will run, using 24-hour format. 0 represents midnight, 12 is noon, and 23 is 11 PM.",
    examples: [
      ["0", "Run at midnight"],
      ["12", "Run at noon"],
      ["*/2", "Run every 2 hours"],
      ["9-17", "Run every hour from 9 AM to 5 PM"],
      ["6,12,18", "Run at 6 AM, noon, and 6 PM"],
    ],
  },
  dayOfMonth: {
    key: "dayOfMonth",
    label: "Day of month",
    short: "day",
    min: 1,
    max: 31,
    unit: "day of the month",
    unitPlural: "days",
    steps: [2, 3, 5, 7, 10, 15],
    rangeDefault: "1-7",
    details:
      "Determines which day(s) of the month the task will run. Be careful with days 29-31 as not all months have these days. You can use 'L' for the last day of the month in some cron implementations.",
    examples: [
      ["1", "Run on the 1st day of each month"],
      ["15", "Run on the 15th day of each month"],
      ["*/7", "Run every 7 days"],
      ["1,15", "Run on the 1st & 15th each month"],
      ["1-7", "Run on days 1 to 7 each month"],
    ],
  },
  month: {
    key: "month",
    label: "Month",
    short: "month",
    min: 1,
    max: 12,
    unit: "month",
    unitPlural: "months",
    steps: [2, 3, 4, 6],
    rangeDefault: "1-6",
    names: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    details:
      "Specifies which month(s) the task will run. January is 1, February is 2, and so on through December which is 12. Some implementations also support 3-letter month abbreviations like JAN, FEB, etc.",
    examples: [
      ["1", "Run only in January"],
      ["6", "Run only in June"],
      ["*/3", "Run every 3 months"],
      ["1,7", "Run in January and July"],
      ["3-5", "Run in March, April, and May"],
    ],
  },
  dayOfWeek: {
    key: "dayOfWeek",
    label: "Day of week",
    short: "weekday",
    min: 0,
    max: 6,
    unit: "day of the week",
    unitPlural: "days of the week",
    steps: [2, 3],
    rangeDefault: "1-5",
    names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    details:
      "Controls which day(s) of the week the task will run. Sunday is 0, Monday is 1, through Saturday which is 6. Some implementations support 7 as Sunday as well, and 3-letter abbreviations like SUN, MON, etc.",
    examples: [
      ["0", "Run on Sundays"],
      ["1", "Run on Mondays"],
      ["1-5", "Run Monday to Friday"],
      ["0,6", "Run on weekends (Sat. & Sun.)"],
      ["*/2", "Run every other day"],
    ],
  },
}

export function valueLabel(field: CronField, value: number) {
  return field.names?.[value - field.min] ?? String(value)
}

const NUMBER = /^\d{1,2}$/

function isValidNumber(field: CronField, text: string) {
  const value = Number(text)
  return NUMBER.test(text) && value >= field.min && value <= field.max
}

function isValidNumberOrRange(field: CronField, text: string) {
  const [start, end, ...rest] = text.split("-")
  if (end === undefined) return isValidNumber(field, start)
  return (
    rest.length === 0 &&
    isValidNumber(field, start) &&
    isValidNumber(field, end) &&
    Number(start) <= Number(end)
  )
}

// Accepts "*", "?" (day fields only), steps ("*/15", "5/15", "0-30/5") and
// lists of numbers and ranges: the forms cron-descriptor can describe.
export function isValidField(key: CronFieldKey, value: string) {
  const field = CRON_FIELDS[key]
  if (value === "*") return true
  if (value === "?") return key === "dayOfMonth" || key === "dayOfWeek"

  const [base, step, ...rest] = value.split("/")
  if (step === undefined) {
    return base.split(",").every((part) => isValidNumberOrRange(field, part))
  }
  return (
    rest.length === 0 &&
    NUMBER.test(step) &&
    Number(step) >= 1 &&
    Number(step) <= field.max &&
    (base === "*" || isValidNumberOrRange(field, base))
  )
}

/** Parses a 5-field expression; returns null if any field is invalid. */
export function parseCronExpression(expression: string): CronFields | null {
  const parts = expression.trim().split(/\s+/)
  if (parts.length !== FIELD_KEYS.length) return null

  const fields = Object.fromEntries(
    FIELD_KEYS.map((key, index) => [key, parts[index]])
  ) as CronFields
  return FIELD_KEYS.every((key) => isValidField(key, fields[key]))
    ? fields
    : null
}

export function formatCronExpression(fields: CronFields) {
  return FIELD_KEYS.map((key) => fields[key]).join(" ")
}

// Values that fit no editor, such as "1-5/2" or "0,30-45", show as "specific"
// with nothing selected; the raw input still edits them.
export function fieldMode(value: string): FieldMode {
  if (value === "*" || value === "?") return "every"
  if (/^\*\/\d+$/.test(value)) return "step"
  if (/^\d+-\d+$/.test(value)) return "range"
  return "specific"
}

/** The value a field takes when the editor switches to `mode`. */
export function modeStartValue(field: CronField, mode: FieldMode) {
  switch (mode) {
    case "every":
      return "*"
    case "step":
      return `*/${field.steps[1]}`
    case "specific":
      return String(field.min)
    case "range":
      return field.rangeDefault
  }
}

/** The numbers in a plain list such as "0,15,30"; empty for any other form. */
export function listValues(value: string) {
  return /^\d+(,\d+)*$/.test(value) ? value.split(",").map(Number) : []
}

export type CronSegment = { text: string; keys: CronFieldKey[] }

const DESCRIPTOR_OPTIONS = {
  use24hourTimeFormat: false,
  verbose: false,
  dayOfWeekStartIndexZero: true,
}

function ordinal(value: string) {
  const n = Number(value)
  const lastTwoDigits = n % 100
  const suffix =
    lastTwoDigits >= 11 && lastTwoDigits <= 13
      ? "th"
      : (["th", "st", "nd", "rd"][n % 10] ?? "th")
  return `${n}${suffix}`
}

function tidy(text: string) {
  return (
    text
      .replace(/^, /, "")
      // "09:00 AM" → "9 AM", "05:59 PM" → "5:59 PM"
      .replace(
        /\b(\d{2}):(\d{2}) ([AP]M)\b/g,
        (_, hour: string, minute: string, period: string) =>
          `${Number(hour)}${minute === "00" ? "" : `:${minute}`} ${period}`
      )
      // "on day 1 and 15 of the month" → "on the 1st and 15th of the month"
      .replace(
        /\bon day ((?:\d+(?:, and |, | and | through ))*\d+)/g,
        (_, days: string) => `on the ${days.replace(/\d+/g, ordinal)}`
      )
  )
}

// cron-descriptor words an hour list as times ("at 09:00 AM and 05:00 PM"),
// which reads as once each when the minutes repeat within those hours.
function duringHours(text: string) {
  if (!text.startsWith("at ")) return text
  const hours = text.slice("at ".length)
  if (hours.includes(" through ")) return `from ${hours}`
  return `during the ${hours} hour${hours.includes(" and ") ? "s" : ""}`
}

const isAny = (value: string) => value === "*" || value === "?"

/**
 * cron-descriptor's wording, split into segments tagged with the fields they
 * describe so the sentence can highlight alongside the field tokens.
 */
export function describeSegments(fields: CronFields): CronSegment[] {
  const segments: CronSegment[] = []
  const add = (text: string, keys: CronFieldKey[]) =>
    segments.push({ text: tidy(text), keys })

  try {
    // cron-descriptor reads a day-of-week "1/2" as "*/2"; spell out the range.
    const dayOfWeek = fields.dayOfWeek.replace(/^(\d)\/(\d+)$/, "$1-6/$2")
    const descriptor = new ExpressionDescriptor(
      formatCronExpression({ ...fields, dayOfWeek }),
      DESCRIPTOR_OPTIONS
    )
    const describe = (type: DescriptionType) => descriptor.getDescription(type)

    const time = describe(DescriptionType.TIMEOFDAY)
    const minutes = describe(DescriptionType.MINUTES)
    const hours = describe(DescriptionType.HOURS)
    if (time !== [minutes, hours].filter(Boolean).join(", ")) {
      // A specific time such as "At 09:00 AM" describes both fields at once.
      add(time, ["minutes", "hours"])
    } else if (!minutes && hours.startsWith("every")) {
      // Minute 0 is implied by "every hour" or "every 2 hours".
      add(hours, ["minutes", "hours"])
    } else {
      // cron-descriptor leaves minute 0 unsaid, so "between 9 AM and 5:59 PM"
      // would read as continuous without "on the hour".
      add(minutes || "on the hour", ["minutes"])
      if (hours !== "every hour") add(duringHours(hours), ["hours"])
    }

    const hasDayOfMonth = !isAny(fields.dayOfMonth)
    const hasDayOfWeek = !isAny(fields.dayOfWeek)
    if (hasDayOfMonth) {
      add(describe(DescriptionType.DAYOFMONTH), ["dayOfMonth"])
    }
    if (hasDayOfWeek) {
      const text = tidy(describe(DescriptionType.DAYOFWEEK))
      // Cron runs when either day field matches, so the two join with "and".
      const joined = text.startsWith("every ")
        ? `and ${text}`
        : `and on ${text.replace(/^only on /, "")}`
      add(hasDayOfMonth ? joined : text, ["dayOfWeek"])
    }
    if (
      !hasDayOfMonth &&
      !hasDayOfWeek &&
      fields.hours !== "*" &&
      !fields.hours.startsWith("*/")
    ) {
      add("every day", ["dayOfMonth", "dayOfWeek"])
    }
    if (fields.month !== "*") {
      add(describe(DescriptionType.MONTH), ["month"])
    }
  } catch {
    return [{ text: "This schedule can't be described", keys: [] }]
  }

  const [first, ...rest] = segments
  return [
    { ...first, text: first.text[0].toUpperCase() + first.text.slice(1) },
    ...rest,
  ]
}

export function randomCronFields(): CronFields {
  const pick = (count: number, start = 0) =>
    Math.random() < 0.3
      ? "*"
      : String(Math.floor(Math.random() * count) + start)

  return {
    minutes: pick(60),
    hours: pick(24),
    dayOfMonth: pick(31, 1),
    month: pick(12, 1),
    dayOfWeek: pick(7),
  }
}

export const COMMON_EXPRESSIONS = [
  { name: "Every minute", cron: "* * * * *" },
  { name: "Every hour", cron: "0 * * * *" },
  { name: "Daily at midnight", cron: "0 0 * * *" },
  { name: "Daily at 9 AM", cron: "0 9 * * *" },
  { name: "Weekly (Sunday)", cron: "0 0 * * 0" },
  { name: "Monthly (1st)", cron: "0 0 1 * *" },
  { name: "Yearly (Jan 1st)", cron: "0 0 1 1 *" },
  { name: "Weekdays at 9 AM", cron: "0 9 * * 1-5" },
]

export const SPECIAL_CHARACTERS = [
  {
    symbol: "*",
    name: "Any Value",
    description: "Matches any value in the field.",
  },
  {
    symbol: ",",
    name: "List",
    description: "Separates multiple specific values.",
  },
  {
    symbol: "-",
    name: "Range",
    description: "Defines a range of values (inclusive).",
  },
  {
    symbol: "/",
    name: "Step",
    description: "Specifies intervals (every X units).",
  },
  {
    symbol: "?",
    name: "Ignore",
    description: "Used when day-of-month or day-of-week should be ignored.",
  },
]
