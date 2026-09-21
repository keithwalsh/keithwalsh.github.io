/** CSVs in `public/data/` loaded as tables when the engine starts. */
export const SAMPLE_FILES = [
  { table: "rain", file: "data/rain.csv" },
  { table: "temperature", file: "data/temperature.csv" },
  { table: "wind", file: "data/wind.csv" },
] as const

/**
 * A week of ten-minute sensor readings with the faults real feeds have: lost
 * readings, one long outage, missing values, late arrivals and re-sent
 * corrections. Built from `hash()` rather than `random()` so every visit gets
 * the same rows.
 */
export const SENSOR_READINGS_SQL = `CREATE OR REPLACE TABLE sensor_readings AS
WITH slots AS (
  SELECT
    sensor_id,
    reading_at,
    (hash(sensor_id || reading_at::VARCHAR) % 1000)::INTEGER AS h
  FROM (VALUES ('S1'), ('S2'), ('S3')) AS sensors(sensor_id)
  CROSS JOIN generate_series(
    TIMESTAMP '2025-01-01 00:00:00',
    TIMESTAMP '2025-01-07 23:50:00',
    INTERVAL 10 MINUTE
  ) AS series(reading_at)
),
delivered AS (
  SELECT
    sensor_id,
    reading_at,
    h,
    CASE WHEN h % 50 <> 1  -- 2% arrive with no value
      THEN round(18 + 4 * sin(epoch(reading_at) / 13751) + h / 500, 2)
    END AS temperature_c
  FROM slots
  WHERE h % 100 <> 0  -- 1% never arrive
    AND NOT (sensor_id = 'S2' AND reading_at
      BETWEEN TIMESTAMP '2025-01-03 02:00:00' AND TIMESTAMP '2025-01-03 09:30:00')
)
SELECT
  sensor_id,
  reading_at,
  reading_at + to_seconds(5 + h % 20)
    + to_hours(CASE WHEN h % 33 = 2 THEN 2 + h % 5 ELSE 0 END) AS received_at,
  temperature_c
FROM delivered
UNION ALL  -- 4% are re-sent later with a corrected value
SELECT
  sensor_id,
  reading_at,
  reading_at + to_minutes(30 + h % 90),
  round(temperature_c + 0.1, 2)
FROM delivered
WHERE h % 25 = 3`

export const EXAMPLES = [
  {
    title: "Longest dry spells",
    technique: "Gaps and islands",
    sql: `-- Gaps and islands: consecutive dry days share one (date - row_number) anchor.
WITH dry_days AS (
  SELECT date
  FROM rain
  WHERE rain_amount_mm = 0
),
spells AS (
  SELECT
    date,
    date - CAST(row_number() OVER (ORDER BY date) AS INTEGER) AS spell_anchor
  FROM dry_days
)
SELECT
  min(date) AS spell_start,
  max(date) AS spell_end,
  count(*) AS length_days
FROM spells
GROUP BY spell_anchor
ORDER BY length_days DESC, spell_start
LIMIT 10`,
  },
  {
    title: "7-day rolling mean",
    technique: "Window frame",
    sql: `-- RANGE, not ROWS: a missing day would shrink the window, not stretch it.
SELECT
  date,
  mean_temp,
  round(avg(mean_temp) OVER last_7_days, 1) AS rolling_mean_temp,
  count(*) OVER last_7_days AS days_in_window
FROM temperature
WINDOW last_7_days AS (
  ORDER BY date
  RANGE BETWEEN INTERVAL 6 DAYS PRECEDING AND CURRENT ROW
)
ORDER BY date DESC
LIMIT 365`,
  },
  {
    title: "Wettest day of each year",
    technique: "QUALIFY",
    sql: `-- QUALIFY filters on a window function with no wrapping subquery.
SELECT
  year(date) AS year,
  date AS wettest_day,
  rain_amount_mm
FROM rain
QUALIFY row_number() OVER (
  PARTITION BY year(date)
  ORDER BY rain_amount_mm DESC, date
) = 1
ORDER BY year`,
  },
  {
    title: "Find gaps in a feed",
    technique: "LAG",
    sql: `-- One reading is expected every 10 minutes; re-sent duplicates collapse first.
WITH readings AS (
  SELECT DISTINCT sensor_id, reading_at
  FROM sensor_readings
),
with_previous AS (
  SELECT
    sensor_id,
    reading_at,
    lag(reading_at) OVER (
      PARTITION BY sensor_id ORDER BY reading_at
    ) AS previous_reading_at
  FROM readings
)
SELECT
  sensor_id,
  previous_reading_at AS gap_start,
  reading_at AS gap_end,
  date_diff('minute', previous_reading_at, reading_at) // 10 - 1 AS missed_readings
FROM with_previous
WHERE reading_at - previous_reading_at > INTERVAL 10 MINUTE
ORDER BY missed_readings DESC, sensor_id, gap_start`,
  },
  {
    title: "Dedupe, keep latest",
    technique: "ROW_NUMBER",
    sql: `-- One row per (sensor_id, reading_at): the version that arrived last wins.
SELECT
  sensor_id,
  reading_at,
  temperature_c,
  received_at,
  count(*) OVER versions AS versions_received
FROM sensor_readings
WINDOW versions AS (PARTITION BY sensor_id, reading_at)
QUALIFY row_number() OVER (
  PARTITION BY sensor_id, reading_at
  ORDER BY received_at DESC
) = 1
ORDER BY versions_received DESC, sensor_id, reading_at`,
  },
] as const

export const DEFAULT_SQL = EXAMPLES[0].sql
