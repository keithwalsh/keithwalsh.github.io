// Simple test for cron expression parsing and description generation
const fs = require('fs');
const path = require('path');

// Read the TypeScript file and extract the functions
const cronHelpersPath = path.join(__dirname, 'src/components/pages/CronExpressions/utils/cronHelpers.ts');
const content = fs.readFileSync(cronHelpersPath, 'utf8');

// Extract the functions we need (simplified JavaScript versions)
function ordinal_indicator(i) {
    let j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return i + "st";
    }
    if (j === 2 && k !== 12) {
        return i + "nd";
    }
    if (j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

function parseStep(value) {
  if (value.includes('/')) {
    const [base, step] = value.split('/')
    return { base, step: parseInt(step, 10) }
  }
  return null
}

function parseRange(value) {
  if (value.includes('-')) {
    const [start, end] = value.split('-').map(v => parseInt(v, 10))
    return { start, end }
  }
  return null
}

function parseList(value) {
  return value.split(',').map(v => parseInt(v.trim(), 10))
}

function getDayNames(dayNumbers) {
  const dayMap = {
    0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
    4: 'Thursday', 5: 'Friday', 6: 'Saturday'
  }
  return dayNumbers.map(num => dayMap[num]).filter(Boolean)
}

function getMonthNames(monthNumbers) {
  const monthMap = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April',
    5: 'May', 6: 'June', 7: 'July', 8: 'August',
    9: 'September', 10: 'October', 11: 'November', 12: 'December'
  }
  return monthNumbers.map(num => monthMap[num]).filter(Boolean)
}

function describeField(value, fieldType) {
  if (value === '*' || value === '?') {
    return fieldType === 'dayOfMonth' && value === '?' ? 'any day of the month' : 'every ' + fieldType
  }

  const step = parseStep(value)
  if (step) {
    if (step.base === '*') {
      return `every ${step.step} ${fieldType}`
    } else {
      return `every ${step.step} ${fieldType} starting from ${step.base}`
    }
  }

  const range = parseRange(value)
  if (range) {
    if (fieldType === 'dayOfWeek') {
      const dayNames = getDayNames(Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i))
      return `on ${dayNames.join(', ')}`
    } else if (fieldType === 'month') {
      const monthNames = getMonthNames(Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start + i))
      return `in ${monthNames.join(', ')}`
    } else {
      return `from ${range.start} to ${range.end} ${fieldType}`
    }
  }

  if (value.includes(',')) {
    const numbers = parseList(value)
    if (fieldType === 'dayOfWeek') {
      const dayNames = getDayNames(numbers)
      return `on ${dayNames.join(', ')}`
    } else if (fieldType === 'month') {
      const monthNames = getMonthNames(numbers)
      return `in ${monthNames.join(', ')}`
    } else if (fieldType === 'dayOfMonth') {
      const ordinals = numbers.map(n => ordinal_indicator(n))
      return `on the ${ordinals.join(', ')} of the month`
    } else {
      return `at ${numbers.join(', ')} ${fieldType}`
    }
  }

  if (fieldType === 'dayOfWeek') {
    const dayName = getDayNames([parseInt(value, 10)])[0]
    return `on ${dayName}`
  } else if (fieldType === 'month') {
    const monthName = getMonthNames([parseInt(value, 10)])[0]
    return `in ${monthName}`
  } else if (fieldType === 'dayOfMonth') {
    return `on the ${ordinal_indicator(parseInt(value, 10))} of the month`
  } else {
    return `at ${value} ${fieldType}`
  }
}

function generateDescription(fields) {
  const parts = []
  
  if (fields.seconds && fields.seconds !== '*') {
    parts.push(describeField(fields.seconds, 'seconds'))
  }
  
  const timeParts = []
  
  if (fields.minutes !== '*') {
    timeParts.push(describeField(fields.minutes, 'minutes'))
  }
  
  if (fields.hours !== '*') {
    timeParts.push(describeField(fields.hours, 'hours'))
  }
  
  if (timeParts.length > 0) {
    parts.push(timeParts.join(' '))
  } else if (!fields.seconds || fields.seconds === '*') {
    parts.push('every minute')
  }
  
  if (fields.dayOfMonth !== '*' && fields.dayOfMonth !== '?') {
    parts.push(describeField(fields.dayOfMonth, 'dayOfMonth'))
  }
  
  if (fields.month !== '*') {
    parts.push(describeField(fields.month, 'month'))
  }
  
  if (fields.dayOfWeek !== '*' && fields.dayOfWeek !== '?') {
    parts.push(describeField(fields.dayOfWeek, 'dayOfWeek'))
  }
  
  if (fields.dayOfMonth === '?' && fields.dayOfWeek !== '*' && fields.dayOfWeek !== '?') {
    const filteredParts = parts.filter(part => !part.includes('day of the month'))
    filteredParts.push(describeField(fields.dayOfWeek, 'dayOfWeek'))
    return filteredParts.join(', ')
  }
  
  if (fields.dayOfWeek === '?' && fields.dayOfMonth !== '*' && fields.dayOfMonth !== '?') {
    const filteredParts = parts.filter(part => !part.includes('on ') || !part.includes('Monday') && !part.includes('Tuesday') && !part.includes('Wednesday') && !part.includes('Thursday') && !part.includes('Friday') && !part.includes('Saturday') && !part.includes('Sunday'))
    filteredParts.push(describeField(fields.dayOfMonth, 'dayOfMonth'))
    return filteredParts.join(', ')
  }
  
  return parts.join(', ')
}

// Test cases
const testCases = [
  { expr: '0 23 ? * MON-FRI', expected: 'At 11:00 PM, on Monday, Tuesday, Wednesday, Thursday, Friday' },
  { expr: '*/45 * * * * *', expected: 'every 45 seconds, every minute' }
];

console.log('Testing cron expression descriptions...\n');

testCases.forEach(({ expr, expected }, index) => {
  console.log(`Test ${index + 1}: ${expr}`);
  
  // Parse the expression manually for testing
  const parts = expr.trim().split(/\s+/);
  let fields;
  
  if (parts.length === 6) {
    fields = {
      seconds: parts[0],
      minutes: parts[1],
      hours: parts[2],
      dayOfMonth: parts[3],
      month: parts[4],
      dayOfWeek: parts[5]
    };
  } else {
    fields = {
      minutes: parts[0],
      hours: parts[1],
      dayOfMonth: parts[2],
      month: parts[3],
      dayOfWeek: parts[4]
    };
  }
  
  const description = generateDescription(fields);
  console.log(`Description: ${description}`);
  console.log(`Expected: ${expected}`);
  console.log(`Match: ${description === expected ? '✓' : '✗'}`);
  console.log('---');
});
