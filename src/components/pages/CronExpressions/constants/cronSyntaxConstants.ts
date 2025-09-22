// Default data and constants for CronSyntaxBar component

import type { FieldData, SpecialCharacterData } from '../types/cronSyntaxTypes';

/**
 * Default field data for cron expression visualization
 */
export const defaultFields: FieldData[] = [
  { 
    abbreviation: "Min.",
    short: "Minute", 
    range: "(0‑59)", 
    desc: "Minute segment",
    detailedDesc: "Controls which minute(s) of the hour the task will run. You can specify exact minutes, ranges, lists, or use step values to run at regular intervals throughout the hour.",
    examples: [
      "0 - Run at the top of the hour (minute 0)",
      "15 - Run at 15 minutes past the hour", 
      "*/5 - Run every 5 minutes",
      "0,20,40 - Run at 0, 20, 40 mins. past the hour",
      "10-20 - Run at minutes 10 through 20"
    ]
  },
  { 
    abbreviation: "Hr.",
    short: "Hour", 
    range: "(0‑23)", 
    desc: "Hour of day",
    detailedDesc: "Specifies which hour(s) of the day the task will run, using 24-hour format. 0 represents midnight, 12 is noon, and 23 is 11 PM.",
    examples: [
      "0 - Run at midnight",
      "12 - Run at noon",
      "*/2 - Run every 2 hours",
      "9-17 - Run every hour from 9 AM to 5 PM",
      "6,12,18 - Run at 6 AM, noon, and 6 PM"
    ]
  },
  { 
    abbreviation: "DOM",
    short: "Day of Month", 
    range: "(1‑31)", 
    desc: "Calendar day",
    detailedDesc: "Determines which day(s) of the month the task will run. Be careful with days 29-31 as not all months have these days. You can use 'L' for the last day of the month in some cron implementations.",
    examples: [
      "1 - Run on the 1st day of each month",
      "15 - Run on the 15th day of each month",
      "*/7 - Run every 7 days",
      "1,15 - Run on the 1st & 15th each month",
      "1-7 - Run on days 1 to 7 each month"
    ]
  },
  { 
    abbreviation: "Month",
    short: "Month", 
    range: "(1‑12)", 
    desc: "January = 1",
    detailedDesc: "Specifies which month(s) the task will run. January is 1, February is 2, and so on through December which is 12. Some implementations also support 3-letter month abbreviations like JAN, FEB, etc.",
    examples: [
      "1 - Run only in January",
      "6 - Run only in June", 
      "*/3 - Run every 3 months",
      "1,7 - Run in January and July",
      "3-5 - Run in March, April, and May"
    ]
  },
  { 
    abbreviation: "DOW",
    short: "Day of Week", 
    range: "(0‑6)", 
    desc: "0 = Sunday",
    detailedDesc: "Controls which day(s) of the week the task will run. Sunday is 0, Monday is 1, through Saturday which is 6. Some implementations support 7 as Sunday as well, and 3-letter abbreviations like SUN, MON, etc.",
    examples: [
      "0 - Run on Sundays",
      "1 - Run on Mondays",
      "1-5 - Run Monday to Friday",
      "0,6 - Run on weekends (Sat. & Sun.)",
      "*/2 - Run every other day"
    ]
  },
];

/**
 * Default special characters data for cron expression table
 */
export const defaultSpecialCharacters: SpecialCharacterData[] = [
  {
    symbol: "*",
    name: "Any Value",
    description: "Matches any value in the field.",
    examples: [
      { value: "* * * * *", meaning: "Run every minute" },
      { value: "0 * * * *", meaning: "Run every hour at minute 0" }
    ]
  },
  {
    symbol: ",",
    name: "List",
    description: "Separates multiple specific values.",
    examples: [
      { value: "0,30 * * * *", meaning: "Run at 0 and 30 minutes past every hour" },
      { value: "0 9,17 * * *", meaning: "Run at 9 AM and 5 PM" }
    ]
  },
  {
    symbol: "-",
    name: "Range",
    description: "Defines a range of values (inclusive).",
    examples: [
      { value: "0 9-17 * * *", meaning: "Run hourly from 9 AM to 5 PM" },
      { value: "0 0 * * 1-5", meaning: "Run at midnight, Monday to Friday" }
    ]
  },
  {
    symbol: "/",
    name: "Step",
    description: "Specifies intervals (every X units).",
    examples: [
      { value: "*/15 * * * *", meaning: "Run every 15 minutes" },
      { value: "0 */2 * * *", meaning: "Run every 2 hours" }
    ]
  },
  {
    symbol: "?",
    name: "Ignore",
    description: "Used when day-of-month or day-of-week should be ignored.",
    examples: [
      { value: "0 0 15 * ?", meaning: "Run on 15th of every month" },
      { value: "0 0 ? * 1", meaning: "Run every Monday at midnight" }
    ]
  }
];

/**
 * Animation configuration constants
 */
export const ANIMATION_CONFIG = {
  SPRING: {
    type: "spring" as const,
    stiffness: 400,
    damping: 17,
    mass: 0.5
  },
  EASE: [0.4, 0.0, 0.2, 1] as const,
  DURATION: {
    SHORT: 0.2,
    MEDIUM: 0.3,
    LONG: 0.5
  },
  STAGGER_DELAY: 0.1
} as const;

/**
 * Component constants
 */
export const COMPONENT_CONFIG = {
  BADGE_SIZE: 50,
  RAIL_TOP_OFFSET: 25,
  MIN_PANEL_HEIGHT: 200,
  MAX_FIELD_WIDTH: 100
} as const; 