/**
 * @fileoverview Chart component displaying temperature and humidity data over time
 * using MUI X-Charts LineChart with dual axes.
 */

import * as React from 'react'
import { Box, Typography, Stack, Slider, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { LineChart } from '@mui/x-charts'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  AccordionSummaryProps,
  accordionSummaryClasses,
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { TemperatureData } from '../utils/csvLoader'

interface TemperatureHumidityChartProps {
  data: TemperatureData[]
}

interface LegendItemProps {
  color: string
  label: string
  dashArray?: string
}

function LegendItem({ color, label, dashArray }: LegendItemProps) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {color === 'area' ? (
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#ff5722',
            opacity: 0.3,
          }}
        />
      ) : (
        <Box
          component="svg"
          sx={{
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <line
            x1="0"
            y1="10"
            x2="20"
            y2="10"
            stroke={color}
            strokeWidth={3}
            strokeDasharray={dashArray}
          />
        </Box>
      )}
      <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
        {label}
      </Typography>
    </Stack>
  )
}

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
    {
      transform: 'rotate(90deg)',
    },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1),
  },
  ...theme.applyStyles('dark', {
    backgroundColor: 'rgba(255, 255, 255, .05)',
  }),
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

export function TemperatureHumidityChart({
  data,
}: TemperatureHumidityChartProps) {
  const [visibleRange, setVisibleRange] = React.useState<number[]>([0, 100])
  const [expanded, setExpanded] = React.useState<string | false>('panel1')

  // Memoize the tick interval calculation
  const getTickInterval = React.useCallback(
    (dataLength: number) => (_: unknown, index: number) =>
      index % Math.max(1, Math.floor(dataLength / 31)) === 0,
    []
  )

  const visibleData = React.useMemo(() => {
    const start = Math.floor((data.length * visibleRange[0]) / 100)
    const end = Math.min(
      Math.ceil((data.length * visibleRange[1]) / 100),
      data.length
    )
    return data.slice(start, end)
  }, [data, visibleRange])

  // Format date for tooltip with better bounds checking
  const getDateLabel = React.useCallback(
    (value: number) => {
      const index = Math.min(
        Math.floor((data.length * value) / 100),
        data.length - 1 // Ensure we never exceed the last index
      )
      if (index >= 0 && index < data.length) {
        const date = new Date(data[index].date)
        return date.toLocaleDateString()
      }
      return ''
    },
    [data]
  )

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  return (
    <Paper elevation={3} sx={{ pt: 3, pb: 0, px: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        <Typography variant="h6">Temperature and Humidity</Typography>
      </Typography>
      {data.length > 0 && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ height: 300 }}>
            <LineChart
              sx={{
                '& .MuiAreaElement-series-max': {
                  fill: '#ff5722',
                  fillOpacity: 0.3,
                },
                '& .MuiAreaElement-series-min': {
                  fill: theme =>
                    theme.palette.mode === 'light' ? '#ffffff' : '#252525',
                },
                '& .MuiChartsAxis-left .MuiChartsAxis-label': {
                  fill: '#ff5722',
                },
                '& .MuiChartsAxis-right .MuiChartsAxis-label': {
                  fill: '#2196f3',
                },
              }}
              series={[
                {
                  data: visibleData.map(d => d.max_temp),
                  id: 'max',
                  label: 'Max. Temperature (°C)',
                  showMark: false,
                  color: 'transparent',
                  area: true,
                  baseline: 'min',
                  valueFormatter: value => `${value}°C`,
                  yAxisId: 'left',
                },
                {
                  data: visibleData.map(d => d.mean_temp),
                  id: 'mean',
                  label: 'Mean Temperature (°C)',
                  color: '#ff5722',
                  showMark: false,
                  yAxisId: 'left',
                },
                {
                  data: visibleData.map(d => d.min_temp),
                  id: 'min',
                  label: 'Min. Temperature (°C)',
                  showMark: false,
                  color: 'transparent',
                  area: true,
                  baseline: 'min',
                  valueFormatter: value => `${value}°C`,
                  yAxisId: 'left',
                },
                {
                  data: visibleData.map(d => d.rel_humidity),
                  id: 'humidity',
                  label: 'Relative Humidity (%)',
                  color: '#2196f3',
                  showMark: false,
                  yAxisId: 'right',
                  valueFormatter: value => `${value}%`,
                },
              ]}
              xAxis={[
                {
                  data: visibleData.map(d =>
                    new Date(d.date).toLocaleDateString()
                  ),
                  scaleType: 'band',
                  tickInterval: getTickInterval(visibleData.length),
                },
              ]}
              yAxis={[
                {
                  id: 'left',
                  label: 'Temperature (°C)',
                  min: -10,
                  max: 30,
                },
                {
                  id: 'right',
                  label: 'Relative Humidity (%)',
                  min: 0,
                  max: 100,
                },
              ]}
              rightAxis="right"
              height={310}
              margin={{ left: 50, right: 50, top: 30, bottom: 50 }}
              slotProps={{
                legend: {
                  hidden: true,
                },
              }}
            />
          </Box>

          {/* Custom Legend */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            sx={{
              mt: 1,
              mb: 1,
              '& > *': {
                flex: {
                  xs: '0 0 calc(50% - 16px)',
                  sm: '0 0 auto',
                },
                textAlign: 'left',
                mb: { xs: 1, sm: 0 },
              },
            }}
          >
            <LegendItem color="#ff5722" label="Mean Temperature" />
            <LegendItem color="area" label="Max/Min Temperature" />
            <LegendItem color="#2196f3" label="Relative Humidity" />
          </Stack>

          {/* Date Range Zoom with Label */}
          <Box sx={{ px: 2, pb: 1, mt: 2 }}>
            <Typography
              variant="caption"
              sx={{ mb: -1, display: 'block', textAlign: 'center' }}
            >
              Date Range Zoom
            </Typography>
            <Box sx={{ width: '80%', mx: 'auto' }}>
              <Slider
                value={visibleRange}
                onChange={(_, newValue) =>
                  setVisibleRange(newValue as number[])
                }
                valueLabelDisplay="auto"
                valueLabelFormat={getDateLabel}
                componentsProps={{
                  valueLabel: {
                    style: {
                      zIndex: 2000,
                      transform: 'translateY(-25px)',
                      ...{
                        '[data-index="1"]': {
                          transform: 'translateY(-25px) translateX(-100%)',
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Accordion
              expanded={expanded === 'panel1'}
              onChange={handleChange('panel1')}
            >
              <AccordionSummary
                aria-controls="climate-content"
                id="climate-header"
              >
                <Typography component="span" variant="body2">
                  Learn More
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography paragraph variant="body2">
                  Ireland's distinctive maritime climate is characterized by its
                  location, being completely surrounded by ocean. This creates a
                  persistent pattern of mild temperatures and frequent rainfall,
                  resulting in consistently high humidity levels throughout the
                  year.
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Understanding Relative Humidity
                </Typography>
                <Typography paragraph variant="body2">
                  Relative humidity measures the amount of water vapor present
                  in the air compared to the maximum amount it could hold at a
                  specific temperature. During summer months, when temperatures
                  rise, the air's capacity to hold moisture increases (a
                  phenomenon explained by the Clausius-Clapeyron relationship).
                  This leads to slight decreases in relative humidity, even
                  though the actual amount of moisture in the air might remain
                  similar.
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Impact on Daily Life
                </Typography>
                <Typography variant="body2">
                  While high humidity combined with high temperatures can impair
                  the body's cooling mechanism by reducing sweat evaporation,
                  Ireland's moderate climate generally prevents the
                  uncomfortable conditions often experienced in warmer regions.
                  Instead, the main effects of Ireland's high humidity are more
                  commonly felt indoors, where it can create a damp environment
                  conducive to mold and mildew growth.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      )}
    </Paper>
  )
}
